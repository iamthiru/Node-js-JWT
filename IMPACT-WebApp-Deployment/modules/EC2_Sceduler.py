# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# (C) Copyright Content

import json
import boto3

region = 'us-east-1'
client = boto3.client('ec2', region_name=region)


def lambda_handler(event, context):

    response = client.describe_instances(InstanceIds=['i-0f3b582affba55a00'])

    for reservation in response["Reservations"]:
        for instance in reservation["Instances"]:
            print(instance["InstanceId"] + "stopping")
            id = [instance["InstanceId"]]
            client.stop_instances(InstanceIds=id)

    return("Complete")
