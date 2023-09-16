from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions,status,generics
from .serializer import * 
from .models import *
from users.models import UserAccount
# Create your views here.


class PostListView(generics.ListAPIView):
    permission_classes=[permissions.IsAuthenticated]
    queryset = Posts.objects.all().exclude(is_deleted=True).order_by('-created_at')
    serializer_class=PostSerializer

class PostHomeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def get(self,request):
        try:
            user =request.user
            followers=Follow.objects.filter(follower=user)
            posts_list=[]
            post_by_follower =Posts.objects.none()
            if followers:
                for fuser in followers:
                    post_by_follower=Posts.objects.filter(author=fuser.following).exclude(is_deleted  = True)
                    posts_list.append(post_by_follower)
            post_by_user = Posts.objects.filter(author=user).exclude(is_deleted = True).order_by('-created_at')
            posts_list = post_by_follower | post_by_user
            serializer = PostSerializer(posts_list,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

#=========================================POST SECTION===================================

class CreatePostView(APIView):
    permission_classes= [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def post(self,request,*args,**kwargs):
        try:
            user = request.user
            img = request.data['img']
            body = request.data['body']
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save(author=user,img=img,body=body)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE)
        except Exception as e:
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)

class UpdatePostView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def post(self,request,pk):
        try:
            user = request.user
            post_object = Posts.objects.get(id=pk)
            serializer =self.serializer_class(post_object,data=request.data,partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors)
        except Posts.DoesNotExist:
            return Response('No such post found.')


#=====================================FETCH POST DETAILS===============================

class PostDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,pk):
        try:
            post = Posts.objects.get(id=pk)
            serializer = PostSerializer(post)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)




#=====================================USER PROFILE=====================================

class ProfileView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,email,*args,**kwargs):
        try:
            profile = UserAccount.objects.get(email=email)
            profile_posts = Posts.objects.filter(author=profile,is_deleted=False).order_by('-updated_at')
            profile_serializer=UserSerializer(profile)
            post_serializer = PostSerializer(profile_posts,many=True)

            context ={
                'profile_user':profile_serializer.data,
                'profile_posts':post_serializer.data
            }
            return Response(context,status=status.HTTP_200_OK)
        except UserAccount.DoesNotExist:
            return Response("User Not Fount",status=status.HTTP_404_NOT_FOUND)