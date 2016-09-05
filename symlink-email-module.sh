#!/usr/bin/env bash

npm uninstall @revector/email-password-top-nav-login --save
ln -s ../../../revector/src/lib/email-password-top-nav-login/ ./src/app/email-password-top-nav-login
sed -i '' 's/@revector\/email-password-top-nav-login/.\/email-password-top-nav-login/' ./src/app/app.module.ts
