from django.urls import path
from .views import *


urlpatterns = [

    path('home',PostHomeView.as_view(),name='explore'),
    path('explore',PostListView.as_view(),name='list_posts'),
    path('profile/<str:email>/',ProfileView.as_view(),name='profile'),

]

