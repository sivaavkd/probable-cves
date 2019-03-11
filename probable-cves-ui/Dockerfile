FROM registry.centos.org/centos/centos:7

RUN mkdir -p /var/www/html

ADD ./src /var/www/html

ADD ./fix-permissions.sh ./install.sh ./passwd.template ./run.sh /opt/scripts/

RUN chmod -R 777 /opt/scripts && . /opt/scripts/install.sh

WORKDIR /var/www/html

USER apache

ENTRYPOINT ["/opt/scripts/run.sh"]

CMD ["apache"]