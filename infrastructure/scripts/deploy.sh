#!/bin/bash

# Required parameters
ENVIRONMENT=""
LOCATION=""
RESOURCE_GROUP=""
SUBSCRIPTION_ID=""
WHAT_IF=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --environment|-e)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --location|-l)
            LOCATION="$2"
            shift 2
            ;;
        --resource-group|-g)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        --subscription|-s)
            SUBSCRIPTION_ID="$2"
            shift 2
            ;;
        --what-if|-w)
            WHAT_IF=true
            shift
            ;;
        *)
            echo "Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z $ENVIRONMENT ]] || [[ -z $LOCATION ]] || [[ -z $RESOURCE_GROUP ]]; then
    echo "Missing required parameters"
    echo "Usage: deploy.sh -e <environment> -l <location> -g <resource-group> [-s <subscription-id>] [-w]"
    exit 1
fi

# Validate environment
if [[ $ENVIRONMENT != "dev" ]] && [[ $ENVIRONMENT != "test" ]] && [[ $ENVIRONMENT != "prod" ]]; then
    echo "Invalid environment. Must be one of: dev, test, prod"
    exit 1
fi

# Set error handling
set -e

# Login to Azure if not already logged in
if ! az account show >/dev/null 2>&1; then
    echo "Logging in to Azure..."
    az login
fi

# Set subscription if provided
if [[ -n $SUBSCRIPTION_ID ]]; then
    echo "Setting subscription to $SUBSCRIPTION_ID..."
    az account set --subscription $SUBSCRIPTION_ID
fi

# Create resource group if it doesn't exist
if ! az group show -n $RESOURCE_GROUP >/dev/null 2>&1; then
    echo "Creating resource group $RESOURCE_GROUP in $LOCATION..."
    az group create --name $RESOURCE_GROUP --location $LOCATION
fi

# Get paths to Bicep files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_FILE="$SCRIPT_DIR/../bicep/main.bicep"
PARAMETERS_FILE="$SCRIPT_DIR/../bicep/parameters/$ENVIRONMENT.parameters.json"

# Validate deployment
echo "Validating deployment..."
az deployment group validate \
    --resource-group $RESOURCE_GROUP \
    --template-file $TEMPLATE_FILE \
    --parameters @$PARAMETERS_FILE

# Deploy infrastructure
echo "Deploying infrastructure to $ENVIRONMENT environment..."
if [[ $WHAT_IF == true ]]; then
    echo "Running in what-if mode..."
    az deployment group what-if \
        --resource-group $RESOURCE_GROUP \
        --template-file $TEMPLATE_FILE \
        --parameters @$PARAMETERS_FILE
else
    az deployment group create \
        --resource-group $RESOURCE_GROUP \
        --template-file $TEMPLATE_FILE \
        --parameters @$PARAMETERS_FILE
fi

echo "Deployment completed successfully!" 