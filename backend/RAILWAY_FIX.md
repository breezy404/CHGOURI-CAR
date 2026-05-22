# Railway: MYSQLHOST=MISSING but variables show in UI

If logs show `MYSQLHOST=MISSING` but you see variables in the dashboard, the **running container is not the service where you added them**.

## Check this first

1. Open the **failed deployment** → **View logs**
2. Find the new line: `Service: ??? | MySQL-related env keys in container: ...`
3. Compare `Service:` name with the service where you added MYSQLHOST variables

If they don't match → add variables on the **deploying** service, then Redeploy.

## Required on the BACKEND service (the one running `npm start`)

Add **either** set A or set B:

### Set A (recommended)
- `MYSQLHOST` = reference or `mysql-sh4f.railway.internal`
- `MYSQLPORT` = `3306`
- `MYSQLUSER` = `root`
- `MYSQLPASSWORD` = (from MySQL service)
- `MYSQLDATABASE` = `railway`

### Set B (one variable workaround)
- `MYSQL_URL` = reference to MySQL service **`MYSQL_URL`** (internal URL with `mysql-sh4f.railway.internal`)
- Do NOT use `MYSQL_PUBLIC_URL` or `interchange.proxy.rlwy.net`

## Railway settings

| Setting | Value |
|---------|--------|
| Root Directory | `backend` |
| Start Command | `npm start` |
| Builder | Dockerfile |

## After variables are on the correct service

Redeploy → logs should show:
```
📍 DB Config [MYSQLHOST]: host=mysql-sh4f.railway.internal ...
```

Seed DB once in Shell: `npm run db:init`
