from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions,status,generics
from .serializer import * 
from .models import *
from users.models import UserAccount
from django.db.models import Q
from operator import attrgetter
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
            posts_by_followers=[]
            post_by_user =Posts.objects.filter(author=user,is_deleted=False).order_by('-created_at')
            for follower in followers:
                posts=Posts.objects.filter(author=follower.following,is_deleted=False).order_by('-created_at')
                posts_by_followers.extend(posts)
            all_posts = list(post_by_user)+posts_by_followers
            all_posts_sorted = sorted(all_posts,key=attrgetter('created_at'),reverse=True)
            serializer = PostSerializer(all_posts_sorted,many=True)
            print('home page is working')
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
        
class DeletePostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self,request,pk):
        try:
            post = Posts.objects.get(id=pk)
            post.is_deleted=True
            post.save()
            return Response(status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            return Response('No post found!',status=status.HTTP_404_NOT_FOUND)

class UpdatePostView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def post(self,request,pk):
        try:
            user = request.user
            post_object = Posts.objects.get(id=pk)
            serializer =self.serializer_class(post_object,data={'body':request.data.get('body')},partial = True)
            if serializer.is_valid():
                serializer.save()
                print('updated successfully')
                return Response(status=status.HTTP_200_OK)
            else:
                print('else condition')
                return Response(serializer.errors)
        except Posts.DoesNotExist:
            print('except condition')
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
        

#====================================POST LIKE SECTION=================================

class LikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,pk):
        try:
            post = Posts.objects.get(pk=pk)
            if request.user in post.likes.all():
                post.likes.remove(request.user)
                return Response('Post unliked ', status=status.HTTP_200_OK)
            else:
                post.likes.add(request.user)
                return Response('Post Liked.',status=status.HTTP_200_OK)

        except Posts.DoesNotExist:
            return Response('Post not found',status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

#====================================POST COMMENT SECTION===================================

class CreateComment(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer

    def post(self, request, pk , *args,**kwargs):
        try:
            user = request.user
            body = request.data['body']
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save(user=user,post_id=pk,body=body)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE)
        except Exception as e:
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class DeleteComment(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self,request,pk):
        try:
            comment = Comment.objects.get(id=pk,user=request.user)
            comment.delete()
            return Response(status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response('No Such comment found',status=status.HTTP_404_NOT_FOUND)



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
        
#==================================SEARCH USERS==================================================

class SearchViewSet(APIView):
    serializer_class = UserSerializer

    def get(self,request,*args, **kwargs):
        try:
            query = self.request.GET.get('q','')
            if query:
                user_results= UserAccount.objects.filter(
                    models.Q(username__icontains=query) |
                    models.Q(first_name__icontains=query) |
                    models.Q(last_name__icontains=query),is_active=True
                )

                post_results = Posts.objects.filter(
                    Q(body__icontains=query,is_deleted=False)
                )
                user_serializer = UserSerializer(user_results,many=True)
                post_serializer = PostSerializer(post_results,many=True)
                user_data = {
                    'users':user_serializer.data,
                }
                post_data = {
                    'posts':post_serializer.data
                }
                response_data = {
                    'user_data':user_data,
                    'post_data':post_data
                }
                print('search results',response_data)
                return Response(response_data,status=status.HTTP_200_OK)
            else:
                print('no user accoding to the search query')
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print('Error:', str(e))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#=======================================FOLLOW USER=================================
class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,pk):
        try:
            user = request.user
            follows = UserAccount.objects.get(id=pk)
            is_following = Follow.objects.filter(follower = user,following = follows)
            if is_following:
                is_following.delete()
                response_msg = 'Unfollowed Successfully'
                # return Response('Unfollowed Successfully',status=status.HTTP_200_OK)
            else:
                new_follow = Follow(follower=user,following=follows)
                new_follow.save()
                response_msg = 'Followed Successfully'
                # return Response('followed Successfully',status=status.HTTP_200_OK)
            is_following_now = Follow.objects.filter(follower = user , following = follows)

            is_following_data = [
                
                {
                    'id':follow.id,
                    'follower_id':follow.follower.id,
                    'following_id':follow.following.id,
                }
                for follow in is_following_now
            ]

            return Response({
                'message':response_msg,
                'is_following':is_following_data,
            },status=status.HTTP_200_OK)
        except UserAccount.DoesNotExist:
            return Response('User not found',status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)
