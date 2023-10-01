from django.dispatch import Signal,receiver
from django.core.mail import send_mail
from django.conf import settings

follow_notification = Signal()

@receiver(follow_notification)
def handle_follow_notification(sender,follower,following,**kwargs):
    print('signal is about to start--------')
    subject = 'New Follower Notification from Instaconnect'
    message = f"Hello {following.username},\n\n"
    message += f"You have a new follower on Instaconnect:\n"
    message += "╭───────────────────────╮\n"
    message += f"   Follower: {follower.username}\n"
    message += "╰───────────────────────╯\n\n"
    message += "Thank you for using Instaconnect!"
    from_email=settings.EMAIL_HOST_USER
    recipient_list=[following.email]
    send_mail(subject,message,from_email,recipient_list,fail_silently=False)
    print('mail send successfully-------------------------')
