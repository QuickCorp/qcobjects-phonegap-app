![logo](https://qcobjects.dev/qcobjects_01.png)

Learn more about QCObjects framework in [https://qcobjects.dev](https://qcobjects.dev)

To start, use:
```shell
> su - qcobjects
```
and go to the path ~/projects/mynewapp

To create a new progressive web app type:
```shell
> qcobjects create mynewapp --pwa
```

To create an accelerated mobile page type:
```shell
> qcobjects create mynewapp --pwa
```

The QCObjects HTTP2 Server Settings file is in:
```shell
/etc/qcobjects/config.json
```

To check the status of the service:
```shell
> service qcobjects status
```

To start|stop|prestart the service:
```shell
> service qcobjects start
> service qcobjects stop
> service qcobjects restart
```

```shell
   .d88888b.  .d8888b.  .d88888b. 888       d8b                888
  d88P" "Y88bd88P  Y88bd88P" "Y88b888       Y8P                888
  888     888888    888888     888888                          888
  888     888888       888     88888888b.  8888 .d88b.  .d8888b888888.d8888b
  888     888888       888     888888 "88b "888d8P  Y8bd88P"   888   88K
  888 Y8b 888888    888888     888888  888  88888888888888     888   "Y8888b.
  Y88b.Y8b88PY88b  d88PY88b. .d88P888 d88P  888Y8b.    Y88b.   Y88b.      X88
   "Y888888"  "Y8888P"  "Y88888P" 88888P"   888 "Y8888  "Y8888P "Y888 88888P'
         Y8b                                888
                                           d88P
                                         888P"

  Usage: qcobjects [options] [command]

  Options:
    -V, --version                output the version number
    -h, --help                   output usage information

  Commands:
    create [options] <appname>   Creates an app with <appname>
    publish [options] <appname>  Publishes an app with <appname>
    generate-sw <appname>        Generates the service worker  <appname>
    launch <appname>             Launches the application

  Use:
    $ qcobjects-cli [command] --help
    For detailed information of a command

```
