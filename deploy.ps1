param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'prod')]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup
)

$Location = "eastus"

# Login to Azure
Connect-AzAccount

# Create resource group if it doesn't exist
$rg = Get-AzResourceGroup -Name $ResourceGroup -ErrorAction SilentlyContinue
if (!$rg) {
    New-AzResourceGroup -Name $ResourceGroup -Location $Location
}

# Deploy infrastructure
New-AzResourceGroupDeployment `
    -Name "deployment-$(Get-Date -Format 'yyyyMMddHHmmss')" `
    -ResourceGroupName $ResourceGroup `
    -TemplateFile "./infrastructure/bicep/main.bicep" `
    -TemplateParameterFile "./infrastructure/bicep/parameters/$Environment.parameters.json"
