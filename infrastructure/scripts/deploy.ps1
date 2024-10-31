[CmdletBinding()]



param(



    [Parameter(Mandatory=$true)]



    [ValidateSet('dev', 'test', 'prod')]



    [string]$Environment,



    



    [Parameter(Mandatory=$true)]



    [string]$Location,



    



    [Parameter(Mandatory=$true)]



    [string]$ResourceGroup,



    



    [Parameter(Mandatory=$false)]



    [string]$SubscriptionId,



    



    [Parameter(Mandatory=$false)]



    [switch]$WhatIf



)







# Set error action preference



$ErrorActionPreference = 'Stop'







# Import required modules



Import-Module Az.Accounts



Import-Module Az.Resources







try {



    # Login to Azure if not already logged in



    $context = Get-AzContext



    if (!$context) {



        Connect-AzAccount



    }







    # Set subscription if provided



    if ($SubscriptionId) {



        Set-AzContext -SubscriptionId $SubscriptionId



    }







    # Create resource group if it doesn't exist



    $rg = Get-AzResourceGroup -Name $ResourceGroup -ErrorAction SilentlyContinue



    if (!$rg) {



        Write-Host "Creating resource group $ResourceGroup in $Location..."



        New-AzResourceGroup -Name $ResourceGroup -Location $Location



    }







    # Get the path to the Bicep template and parameters



    $templateFile = Join-Path $PSScriptRoot "..\bicep\main.bicep"



    $parametersFile = Join-Path $PSScriptRoot "..\bicep\parameters\$Environment.parameters.json"







    # Validate the deployment



    Write-Host "Validating deployment..."



    $validation = Test-AzResourceGroupDeployment `



        -ResourceGroupName $ResourceGroup `



        -TemplateFile $templateFile `



        -TemplateParameterFile $parametersFile







    if ($validation) {



        Write-Error "Template validation failed:`n$($validation.Message)"



        exit 1



    }







    # Deploy the infrastructure



    Write-Host "Deploying infrastructure to $Environment environment..."



    if ($WhatIf) {



        Write-Host "WhatIf mode enabled. No changes will be made."



        $deployment = New-AzResourceGroupDeployment `



            -ResourceGroupName $ResourceGroup `



            -TemplateFile $templateFile `



            -TemplateParameterFile $parametersFile `



            -WhatIf



    }



    else {



        $deployment = New-AzResourceGroupDeployment `



            -ResourceGroupName $ResourceGroup `



            -TemplateFile $templateFile `



            -TemplateParameterFile $parametersFile



    }







    # Output deployment results



    if ($deployment.ProvisioningState -eq 'Succeeded') {



        Write-Host "Deployment completed successfully!"



        Write-Host "Outputs:"



        $deployment.Outputs | Format-Table -AutoSize



    }



    else {



        Write-Error "Deployment failed with state: $($deployment.ProvisioningState)"



        exit 1



    }



}



catch {



    Write-Error $_.Exception.Message



    exit 1



} 


