# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# (C) Copyright Content
# Date: 07/05/2021

# ----------------------------------------------------------------------------------------------------------------------
# AWS Scheduler - Lambda Function to Start EC2 Testing Instance
# ----------------------------------------------------------------------------------------------------------------------

import json
import boto3

region = 'us-east-1'
instances = ['i-038ee1efd3c697723']
client = boto3.client('ec2', region_name=region)


def lambda_handler(event, context):
    # TODO implement
    client.start_instances(InstanceIds=instances)
    response = "Started Instances : " + str(instances)

    return{
        'statusCode': 200,
        'body': json.dumps(response)
    }

# ----------------------------------------------------------------------------------------------------------------------
