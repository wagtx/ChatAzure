param name string
param location string
param skuName string = 'Basic'
param skuFamily string = 'C'
param skuCapacity int = 1

resource redis 'Microsoft.Cache/Redis@2021-06-01' = {
  name: name
  location: location
  properties: {
    sku: {
      name: skuName
      family: skuFamily
      capacity: skuCapacity
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    redisConfiguration: {
      'maxmemory-policy': 'volatile-lru'
    }
  }
}

output hostName string = redis.properties.hostName
output primaryKey string = listKeys(redis.id, redis.apiVersion).primaryKey
output connectionString string = '${name}.redis.cache.windows.net:6380,password=${listKeys(redis.id, redis.apiVersion).primaryKey},ssl=True,abortConnect=False'


