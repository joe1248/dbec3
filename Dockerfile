# 1.docker build -t my_dbec3_image .

# 2.A . winpty docker run -ti --rm my_dbec3_image bash
# 2.B . docker run -d --rm --name my_running_container_dbec3 my_dbec3_image
#               d=detached rm=remove_auto


# STEP 1 : Get PHP-cli + APACHE-server, then copy php.ini into the image, then copy the code into the image
FROM php:7.2.1-apache

# STEP 2 : UPdate, get PHP extensions and composer
RUN apt-get update && apt-get install -y zip unzip git \
    #&& pecl install xdebug
    #&& docker-php-ext-enable xdebug
#   && docker-php-ext-install pdo_mysql
	&& php -r "readfile('https://getcomposer.org/installer');" | php -- --install-dir=/usr/local/bin --filename=composer \
	&& chmod +sx /usr/local/bin/composer

# STEP 3/4 : Copy composer files to the container
COPY composer.json ./
COPY composer.lock ./

# STEP 5 : install dependencies
RUN composer install --no-interaction --no-scripts --no-autoloader --no-plugins

# STEP 6: copy PHP ini file to configure PHP
#COPY conf/php.ini /etc/php/7.1/fpm/conf.d/40-custom.ini
#COPY config/php.ini /usr/local/etc/php/
# STEP 7: copy HTTPD.conf ini file to configure Apache
COPY docker/httpd.conf /etc/apache2/sites-enabled/000-default.conf
#COPY .env.dist ./.env

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
#&& \
 # composer run-scripts post-install-cmd

# now node.JS ??
EXPOSE 80 443
# add volumes

# The container does not get created !
#ENTRYPOINT ["service", "apache2", "restart"]

