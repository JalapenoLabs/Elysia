# Copyright © 2025 Jalapeno Labs

import sys
import templates
from env import SERVER_URL, SERVER_PORT, SERVER_HOST, RELOAD


def main() -> int:
    try:
        print(templates.get_template("welcome").format(url=SERVER_URL))

        import uvicorn
        from langgraph.src.server.starlette import app

        uvicorn.run(
            app,
            host=SERVER_HOST,
            port=SERVER_PORT,
            reload=RELOAD,
        )
        return 0
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
        return 0


if __name__ == "__main__":
    sys.exit(main())
