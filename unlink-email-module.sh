#!/usr/bin/env bash

rm ./src/app/email-password-top-nav-login
sed -i '' 's/.\/email-password-top-nav-login/@revector\/email-password-top-nav-login/' ./src/app/app.module.ts
npm install --save @revector/email-password-top-nav-login
