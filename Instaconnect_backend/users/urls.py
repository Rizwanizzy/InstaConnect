from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView

from .views import getRoutes,RetrieveUserView,RegisterUser,UpdateUserView,UsersList


urlpatterns = [

    path('',getRoutes,name='getRoutes'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('users/me/',RetrieveUserView.as_view() ,name='getRoutes'),
    path('register/',RegisterUser.as_view(),name='register'),
    path('user-update/',UpdateUserView.as_view(),name='register'),
    
    path('userslist/',UsersList.as_view(),name='userslist'),
]

