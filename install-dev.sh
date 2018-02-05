#!/usr/bin/env bash

composer install
npm install
npm run dev
cp .env.dist ./.env
cp docker/php.ini /usr/local/etc/php/conf.d/
cp docker/httpd.conf /etc/apache2/sites-enabled/000-default.conf

