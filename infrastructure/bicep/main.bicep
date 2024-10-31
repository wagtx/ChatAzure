param location string = resourceGroup().location

param environment string

param appName string

param appServicePlanSku object

param aiServiceSku string

param redisCacheSku object

param enablePrivateEndpoints bool

param tags object



// Virtual Network

resource vnet 'Microsoft.Network/virtualNetworks@2021-03-01' = {

  name: '${appName}-vnet-${environment}'

  location: location

  tags: tags

  properties: {

    addressSpace: {

      addressPrefixes: [

        '10.0.0.0/16'

      ]

    }

    subnets: [

      {

        name: 'app-subnet'

        properties: {

          addressPrefix: '10.0.1.0/24'

          delegations: [

            {

              name: 'webapp'

              properties: {

                serviceName: 'Microsoft.Web/serverFarms'

              }

            }

          ]

        }

      }

      {

        name: 'private-endpoints'

        properties: {

          addressPrefix: '10.0.2.0/24'

          privateEndpointNetworkPolicies: 'Disabled'

        }

      }

    ]

  }

}



// App Service Plan

resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {

  name: '${appName}-plan-${environment}'

  location: location

  tags: tags

  sku: appServicePlanSku

  properties: {

    reserved: true

  }

}



// Web App

resource webApp 'Microsoft.Web/sites@2021-02-01' = {

  name: '${appName}-web-${environment}'

  location: location

  tags: tags

  properties: {

    serverFarmId: appServicePlan.id

    httpsOnly: true

    siteConfig: {

      linuxFxVersion: 'DOTNETCORE|8.0'

      alwaysOn: true

      cors: {

        allowedOrigins: ['*']

      }

      appSettings: [

        {

          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'

          value: appInsights.properties.InstrumentationKey

        }

        {

          name: 'AzureAd:Instance'

          value: 'https://login.microsoftonline.com/'

        }

        {

          name: 'Redis:ConnectionString'

          value: redis.outputs.connectionString

        }

        {

          name: 'CosmosDb:ConnectionString'

          value: cosmos.outputs.connectionString

        }

      ]

    }

  }

}



// Application Insights

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {

  name: '${appName}-ai-${environment}'

  location: location

  tags: tags

  kind: 'web'

  properties: {

    Application_Type: 'web'

  }

}



// Azure AI Service

resource aiService 'Microsoft.CognitiveServices/accounts@2021-04-30' = {

  name: '${appName}-ai-${environment}'

  location: location

  tags: tags

  sku: {

    name: aiServiceSku

  }

  kind: 'OpenAI'

  properties: {

    customSubDomainName: '${appName}-ai-${environment}'

  }

}



// Redis Cache Module

module redis './modules/redis.bicep' = {

  name: 'redis-deployment'

  params: {

    name: '${appName}-redis-${environment}'

    location: location

    skuName: redisCacheSku.name

    skuFamily: redisCacheSku.family

    skuCapacity: redisCacheSku.capacity

  }

}



// Cosmos DB Module

module cosmos './modules/cosmos.bicep' = {

  name: 'cosmos-deployment'

  params: {

    name: '${appName}-cosmos-${environment}'

    location: location

    databaseName: 'ChatDb'

    containerName: 'Messages'

  }

}



// Key Vault

resource keyVault 'Microsoft.KeyVault/vaults@2021-06-01-preview' = {

  name: '${appName}-kv-${environment}'

  location: location

  tags: tags

  properties: {

    tenantId: subscription().tenantId

    sku: {

      family: 'A'

      name: 'standard'

    }

    accessPolicies: []

    enableRbacAuthorization: true

  }

}



// Private Endpoints (if enabled)

resource privateEndpoints 'Microsoft.Network/privateEndpoints@2021-03-01' = if (enablePrivateEndpoints) {

  name: '${appName}-pe-${environment}'

  location: location

  tags: tags

  properties: {

    subnet: {

      id: vnet.properties.subnets[1].id

    }

    privateLinkServiceConnections: [

      {

        name: 'cosmos'

        properties: {

          privateLinkServiceId: cosmos.id

          groupIds: ['Sql']

        }

      }

    ]

  }

}



output webAppName string = webApp.name

output aiServiceName string = aiService.name

output keyVaultName string = keyVault.name


