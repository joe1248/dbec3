# Prerequisite : git clone dbec,
# docker build -t my_dbec3_image .

# docker run -d -p80:80 --rm --name my_dbec_web_server my_dbec3_image


# STEP 0 : Get PHP-cli + APACHE-server, then copy php.ini into the image, then copy the code into the image
FROM php:7.2-apache

# set maintainer
LABEL maintainer "josephbarban@gmail.com"

# STEP 1 : Update OS, add some tools and nodeJS which includes NPM
RUN apt-get update \
    && apt-get install -y \
    apt-utils \
    # net-tools needed to be able to test network interfaces: netstat -tlnp
    net-tools \
    mysql-client \
    zip \
    # libzip-dev needed by docker-php-ext-install zip
    libzip-dev \
    unzip \
    git \
    # wget and gnupg need by node.js
    wget \
    gnupg \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs

# STEP 2 : get PHP extensions and composer
RUN docker-php-ext-install \
    pdo_mysql \
    # zip extension needed by phpunit
    zip \
    && pecl install xdebug \
    && docker-php-ext-enable \
    xdebug \
    && php -r "readfile('https://getcomposer.org/installer');" | php -- --install-dir=/usr/local/bin --filename=composer \
	&& chmod +sx /usr/local/bin/composer
	
# STEP 3: Copy composer files
COPY composer.json ./
COPY composer.lock ./

# STEP 4: install Back-End dependencies
RUN composer install --no-interaction --no-scripts --no-autoloader --no-plugins

# STEP 5: Copy NPM files
COPY package.json ./
COPY package-lock.json ./

# STEP 6: install Front-End dependencies
RUN npm install --ignore-scripts --unsafe-perm

# STEP 7: BUILD FRONT-end minimized assets
COPY assets ./assets
COPY public ./public
COPY .babelrc ./
COPY tsconfig.json ./
COPY webpack.config.js ./
RUN npm run dev

# STEP 8: copy confs...
    # copy PHP ini file to configure PHP
COPY docker/php.ini /usr/local/etc/php/conf.d/
    # copy HTTPD.conf ini file to configure Apache
COPY docker/httpd.conf /etc/apache2/sites-enabled/000-default.conf
    # copy default ENV var
COPY .env.dist ./.env

# Including apache expires module
#RUN ln -s /etc/apache2/mods-available/expires.load /etc/apache2/mods-enabled/

# Enabling module headers
RUN a2enmod headers
# Enabling module rewrite
RUN a2enmod rewrite



# STEP 8 : Copy the App
COPY . ./

# STEP 9: generate autoloader MUST BE DONE AFTER COPYING THE APP
RUN composer dump-autoload --optimize


RUN echo '<?php phpinfo();' > ./public/build/index.php

EXPOSE 80 443