# Copyright © 2025 Jalapeno Labs

from starlette.applications import Starlette
from server import routes

app = Starlette(
    routes=routes,
    middleware=[],
)
