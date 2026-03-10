# DevOps Assets

This folder contains deployment-related artifacts.

## Contents

- `docker/` Dockerfiles used by root `docker-compose.yml`
- `kubernetes/` production-oriented backend manifests and examples

## Usage

For local team setup, prefer root-level Docker Compose:

```bash
docker compose up --build
```

Kubernetes notes:

- Apply `persistentvolumeclaim.yaml` before the backend deployment.
- Copy `configmap.example.yaml` and `secret.example.yaml` into environment-specific manifests before applying them.
- The backend stores uploads on disk. Keep `replicas: 1` unless you switch to shared/object storage.
