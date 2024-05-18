import os

from fastapi import FastAPI
from vpnaas_gateway.api.routes.certs import certs_router
from vpnaas_gateway.api.routes.ton import ton_router


app = FastAPI(docs_url='/api_docs')
app.include_router(router=certs_router)
app.include_router(router=ton_router)
