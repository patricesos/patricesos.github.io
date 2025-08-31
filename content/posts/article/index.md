+++
date = '2025-08-31T19:08:28Z'
draft = true
title = 'Install Docker on Fedora'
+++

# Docker on fedora Linux

## Clean up

First time docker install.

Make sure there isn't any docker unofficial package installed

```bash
sudo dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```

Possibly remove this for a clean install `/var/lib/docker`

### Install using rpm repo

```bash
sudo dnf -y install dnf-plugins-core
sudo dnf-3 config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
```

To install the latest docker version

```bash
 sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

To install a specific version

```bash
dnf list docker-ce --showduplicates | sort -r

docker-ce.x86_64    3:28.3.3-1.fc41    docker-ce-stable
docker-ce.x86_64    3:28.3.2-1.fc41    docker-ce-stable
```

```bash
 sudo dnf install docker-ce-VERSION_STRING docker-ce-cli-VERSION_STRING containerd.io docker-buildx-plugin docker-compose-plugin
```

`VERSION_STRING` being `3:28.3.3-1.fc41` in this case

### Start docker

It does not run after install
To enable docker on boot

```bash
sudo systemctl enable --now docker
```

If not

```bash
sudo systemctl start docker
```

Test docker

```bash
sudo docker run hello-world
```

## Docker user group

Docker daemon always runs as root and is bind to the Unix socket. Only root users can access it without `sudo`.

`docker group` thus grants root-level privileges to the user.

Create the group

```bash
sudo groupadd docker
```

add user to group

```bash
sudo usermod -aG docker $USER
```

Reboot to active changes to groups

```bash
newgrp docker
```
