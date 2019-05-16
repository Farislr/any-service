#!/bin/bash

eval "$(ssh-agent -s)"
chmod 600 ./deploy_key
echo -e "Host ssh.acite.net\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
ssh-add ./deploy_key
ssh -i ./deploy_key farislr@ssh.acite.net pwd
