
import os
from .channelsmiddleware import JwtAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter,URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Instaconnect_backend.settings')

django_asgi_application = get_asgi_application()

from chat import routing as chatrouting
from post import routing as postrouting

application = ProtocolTypeRouter(
    {
        'http':django_asgi_application,
        'websocket':
        AllowedHostsOriginValidator(
            JwtAuthMiddlewareStack(
                URLRouter(chatrouting.websocket_urlpatterns + postrouting.websocket_urlpatterns)
            )
        )
    }
)