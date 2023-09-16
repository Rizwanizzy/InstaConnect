from django.urls import path
from .views import *


urlpatterns = [

    path('home/',PostHomeView.as_view(),name='explore'),
    path('explore/',PostListView.as_view(),name='list_posts'),
    path('profile/<str:email>/',ProfileView.as_view(),name='profile'),
    path('create-post/',CreatePostView.as_view(),name='create-posts'),
    path('post-detail/<int:pk>/', PostDetail.as_view(), name='like-post')
]

