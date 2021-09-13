import Zak from 'views/zak/Dashboard/Zak.jsx'

import TeamMember from 'views/modules/Team/TeamMember.jsx'
import AddTeamMember from 'views/modules/Team/AddTeamMember.jsx'
import DeleteTeamMember from 'views/modules/Team/DeleteTeamMember.jsx'

import Testimonial from 'views/modules/Testimonial/Testimonial.jsx'
import AddTestimonial from 'views/modules/Testimonial/AddTestimonial.jsx'
import DeleteTestimonial from 'views/modules/Testimonial/DeleteTestimonial.jsx'

import Client from 'views/modules/Client/Client.jsx'
import AddClient from 'views/modules/Client/AddClient.jsx'
import DeleteClient from 'views/modules/Client/DeleteClient.jsx'

import Faq from 'views/modules/Faq/Faq.jsx'
import AddFaq from 'views/modules/Faq/AddFaq.jsx'
import DeleteFaq from 'views/modules/Faq/DeleteFaq.jsx'

import Contact from 'views/modules/Contact/Contact.jsx'
import AddContact from 'views/modules/Contact/AddContact.jsx'
import DeleteContact from 'views/modules/Contact/DeleteContact.jsx'

import Chat from 'views/modules/Chat/Chat.jsx'
import AddChat from 'views/modules/Chat/AddChat.jsx'
import DeleteChat from 'views/modules/Chat/DeleteChat.jsx'

import User from 'views/modules/User/User.jsx'
import AddUser from 'views/modules/User/AddUser.jsx'
import DeleteUser from 'views/modules/User/DeleteUser.jsx'

import Event from 'views/modules/Event/Event.jsx'
import AddEvent from 'views/modules/Event/AddEvent.jsx'
import DeleteEvent from 'views/modules/Event/DeleteEvent.jsx'

import Eventcategory from 'views/modules/Event/Eventcategory.jsx'
import AddEventcategory from 'views/modules/Event/AddEventcategory.jsx'
import DeleteEventcategory from 'views/modules/Event/DeleteEventcategory.jsx'

import Mailinbox from 'views/modules/Mail/Inbox.jsx'
import Mailcompose from 'views/modules/Mail/Compose.jsx'
import Mailview from 'views/modules/Mail/View.jsx'

import Mailcategory from 'views/modules/Mail/Mailcategory.jsx'
import AddMailcategory from 'views/modules/Mail/AddMailcategory.jsx'
import DeleteMailcategory from 'views/modules/Mail/DeleteMailcategory.jsx'

import Follower from 'views/modules/Follower/Follower.jsx'

import Friend from 'views/modules/Friend/Friend.jsx'

import Album from 'views/modules/Album/Album.jsx'
import AddAlbum from 'views/modules/Album/AddAlbum.jsx'
import DeleteAlbum from 'views/modules/Album/DeleteAlbum.jsx'
import ManageAlbum from 'views/modules/Album/ManageAlbum.jsx'

import File from 'views/modules/File/File.jsx'
import AddFile from 'views/modules/File/AddFile.jsx'
import DeleteFile from 'views/modules/File/DeleteFile.jsx'

import Portfolio from 'views/modules/Portfolio/Portfolio.jsx'
import AddPortfolio from 'views/modules/Portfolio/AddPortfolio.jsx'
import DeletePortfolio from 'views/modules/Portfolio/DeletePortfolio.jsx'
import ManagePortfolio from 'views/modules/Portfolio/ManagePortfolio.jsx'
import UploadPortfolioMedia from 'views/modules/Portfolio/UploadPortfolioMedia.jsx'

import PortfolioMedia from 'views/modules/Portfolio/PortfolioMedia.jsx'
import AddPortfolioMedia from 'views/modules/Portfolio/AddPortfolioMedia.jsx'
import DeletePortfolioMedia from 'views/modules/Portfolio/DeletePortfolioMedia.jsx'

import Blog from 'views/modules/Blog/Blog.jsx'
import AddBlog from 'views/modules/Blog/AddBlog.jsx'
import DeleteBlog from 'views/modules/Blog/DeleteBlog.jsx'
import ViewBlog from 'views/modules/Blog/ViewBlog.jsx'

import Blogcategory from 'views/modules/Blog/Blogcategory.jsx'
import AddBlogcategory from 'views/modules/Blog/AddBlogcategory.jsx'
import DeleteBlogcategory from 'views/modules/Blog/DeleteBlogcategory.jsx'

// import Comment from "views/modules/Comment/Comment.jsx";
// import AddComment from "views/modules/Comment/AddComment.jsx";
// import DeleteComment from "views/modules/Comment/DeleteComment.jsx";

import Login from 'views/modules/Access/Login.jsx'
import Register from 'views/modules/Access/Register.jsx'
import LockScreen from 'views/modules/Access/LockScreen.jsx'
import ResetPassword from 'views/modules/Access/ResetPassword.jsx'
import ForgotPassword from 'views/modules/Access/ForgotPassword.jsx'
import Logout from 'views/modules/Access/Logout.jsx'

var BASEDIR = process.env.REACT_APP_BASEDIR

var dashRoutes = [
  //{ path: "#", name: "Main", type: "navgroup"},
  {
    path: BASEDIR + '/zak/dashboard',
    name: 'Dashboard',
    icon: 'speedometer',
    badge: '',
    component: Zak,
  },

  {
    path: '#',
    name: 'Users',
    icon: 'user',
    type: 'dropdown',
    parentid: 'users',
    child: [
      { path: BASEDIR + '/zak/users', name: 'Users' },
      { path: BASEDIR + '/zak/add-user', name: 'Add User' },
      /*{ path: BASEDIR+"/zak/delete-user", name: "Delete User"},*/
    ],
  },
  { path: BASEDIR + '/zak/users', component: User, type: 'child' },
  { path: BASEDIR + '/zak/add-user', component: AddUser, type: 'child' },
  { path: BASEDIR + '/zak/delete-user', component: DeleteUser, type: 'child' },

  {
    path: '#',
    name: 'Events',
    icon: 'event',
    type: 'dropdown',
    parentid: 'events',
    child: [
      { path: BASEDIR + '/zak/events', name: 'Events' },
      { path: BASEDIR + '/zak/add-event', name: 'Add Event' },
      /*{ path: BASEDIR+"/zak/delete-event", name: "Delete Event"},*/
      { path: BASEDIR + '/zak/eventcategories', name: 'Event Categories' },
      { path: BASEDIR + '/zak/add-eventcategory', name: 'Add Event Category' },
      /*{ path: BASEDIR+"/zak/delete-eventcategory", name: "Delete Eventcategory"},*/
    ],
  },
  { path: BASEDIR + '/zak/events', component: Event, type: 'child' },
  { path: BASEDIR + '/zak/add-event', component: AddEvent, type: 'child' },
  {
    path: BASEDIR + '/zak/delete-event',
    component: DeleteEvent,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/eventcategories',
    component: Eventcategory,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/add-eventcategory',
    component: AddEventcategory,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/delete-eventcategory',
    component: DeleteEventcategory,
    type: 'child',
  },

  {
    path: '#',
    name: 'Mails',
    icon: 'envelope',
    type: 'dropdown',
    parentid: 'mails',
    child: [
      { path: BASEDIR + '/zak/mail-inbox', name: 'Inbox' },
      { path: BASEDIR + '/zak/mail-compose', name: 'Compose' },
      // { path: BASEDIR + "/zak/mail-view", name: "View" },
      { path: BASEDIR + '/zak/mailcategories', name: 'Mail Categories' },
      { path: BASEDIR + '/zak/add-mailcategory', name: 'Add Mail Category' },
      /*{ path: BASEDIR+"/zak/delete-mailcategory", name: "Delete Mailcategory"},*/
    ],
  },
  { path: BASEDIR + '/zak/mail-inbox', component: Mailinbox, type: 'child' },
  {
    path: BASEDIR + '/zak/mail-compose',
    component: Mailcompose,
    type: 'child',
  },
  { path: BASEDIR + '/zak/mail-view', component: Mailview, type: 'child' },
  {
    path: BASEDIR + '/zak/mailcategories',
    component: Mailcategory,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/add-mailcategory',
    component: AddMailcategory,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/delete-mailcategory',
    component: DeleteMailcategory,
    type: 'child',
  },

  {
    path: '#',
    name: 'Friends',
    icon: 'people',
    type: 'dropdown',
    parentid: 'friends',
    child: [{ path: BASEDIR + '/zak/friends', name: 'Friends' }],
  },
  { path: BASEDIR + '/zak/friends', component: Friend, type: 'child' },

  {
    path: '#',
    name: 'Followers',
    icon: 'user-follow',
    type: 'dropdown',
    parentid: 'followers',
    child: [{ path: BASEDIR + '/zak/followers', name: 'Followers' }],
  },
  { path: BASEDIR + '/zak/followers', component: Follower, type: 'child' },

  {
    path: '#',
    name: 'Albums',
    icon: 'picture',
    type: 'dropdown',
    parentid: 'albums',
    child: [
      { path: BASEDIR + '/zak/albums', name: 'Albums' },
      { path: BASEDIR + '/zak/add-album', name: 'Add Album' },
      /*{ path: BASEDIR+"/zak/manage-album", name: "Manage Album"},*/
      /*{ path: BASEDIR+"/zak/delete-album", name: "Delete Album"},*/
    ],
  },
  { path: BASEDIR + '/zak/albums', component: Album, type: 'child' },
  { path: BASEDIR + '/zak/add-album', component: AddAlbum, type: 'child' },
  {
    path: BASEDIR + '/zak/manage-album',
    component: ManageAlbum,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/delete-album',
    component: DeleteAlbum,
    type: 'child',
  },

  {
    path: '#',
    name: 'Blogs',
    icon: 'book-open',
    type: 'dropdown',
    parentid: 'blogs',
    child: [
      { path: BASEDIR + '/zak/blogs', name: 'Blogs' },
      { path: BASEDIR + '/zak/add-blog', name: 'Add Blog' },
      // { path: BASEDIR + '/zak/view-blog', name: 'View Blog' },
      /*{ path: BASEDIR+"/zak/delete-blog", name: "Delete Blog"},*/
      { path: BASEDIR + '/zak/blogcategories', name: 'Blog Categories' },
      { path: BASEDIR + '/zak/add-blogcategory', name: 'Add Blog Category' },
      /*{ path: BASEDIR+"/zak/delete-blogcategory", name: "Delete Blogcategory"},*/
    ],
  },
  { path: BASEDIR + '/zak/blogs', component: Blog, type: 'child' },
  { path: BASEDIR + '/zak/add-blog', component: AddBlog, type: 'child' },
  { path: BASEDIR + '/zak/view-blog', component: ViewBlog, type: 'child' },
  { path: BASEDIR + '/zak/delete-blog', component: DeleteBlog, type: 'child' },
  {
    path: BASEDIR + '/zak/blogcategories',
    component: Blogcategory,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/add-blogcategory',
    component: AddBlogcategory,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/delete-blogcategory',
    component: DeleteBlogcategory,
    type: 'child',
  },

  {
    path: '#',
    name: 'Files',
    icon: 'docs',
    type: 'dropdown',
    parentid: 'files',
    child: [
      { path: BASEDIR + '/zak/files', name: 'Files' },
      { path: BASEDIR + '/zak/add-file', name: 'Add File' },
      /*{ path: BASEDIR+"/zak/delete-file", name: "Delete File"},*/
    ],
  },
  { path: BASEDIR + '/zak/files', component: File, type: 'child' },
  { path: BASEDIR + '/zak/add-file', component: AddFile, type: 'child' },
  { path: BASEDIR + '/zak/delete-file', component: DeleteFile, type: 'child' },

  {
    path: '#',
    name: 'Portfolios',
    icon: 'diamond',
    type: 'dropdown',
    parentid: 'portfolios',
    child: [
      { path: BASEDIR + '/zak/portfolios', name: 'Portfolios' },
      { path: BASEDIR + '/zak/add-portfolio', name: 'Add Portfolio' },
      /*{ path: BASEDIR+"/zak/manage-portfolio", name: "Manage Portfolio"},*/
      /*{ path: BASEDIR+"/zak/delete-portfolio", name: "Delete Portfolio"},*/
      {
        path: BASEDIR + '/zak/upload-media-portfolio',
        name: 'Bulk Upload Media',
      },
      { path: BASEDIR + '/zak/portfoliomedia', name: 'Portfolio Media' },
      {
        path: BASEDIR + '/zak/add-portfoliomedia',
        name: 'Add Portfolio Media',
      },
      /*{ path: BASEDIR+"/zak/delete-portfoliomedia", name: "Delete Portfolio Media"},*/
    ],
  },
  { path: BASEDIR + '/zak/portfolios', component: Portfolio, type: 'child' },
  {
    path: BASEDIR + '/zak/add-portfolio',
    component: AddPortfolio,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/manage-portfolio',
    component: ManagePortfolio,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/delete-portfolio',
    component: DeletePortfolio,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/upload-media-portfolio',
    component: UploadPortfolioMedia,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/portfoliomedia',
    component: PortfolioMedia,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/add-portfoliomedia',
    component: AddPortfolioMedia,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/delete-portfoliomedia',
    component: DeletePortfolioMedia,
    type: 'child',
  },

  {
    path: '#',
    name: 'Chats',
    icon: 'bubbles',
    type: 'dropdown',
    parentid: 'chats',
    child: [
      { path: BASEDIR + '/zak/chats', name: 'Chats' },
      { path: BASEDIR + '/zak/add-chat', name: 'Add Chat' },
      /*{ path: BASEDIR+"/zak/delete-chat", name: "Delete Chat"},*/
    ],
  },
  { path: BASEDIR + '/zak/chats', component: Chat, type: 'child' },
  { path: BASEDIR + '/zak/add-chat', component: AddChat, type: 'child' },
  { path: BASEDIR + '/zak/delete-chat', component: DeleteChat, type: 'child' },

  {
    path: '#',
    name: 'Team Members',
    icon: 'organization',
    type: 'dropdown',
    parentid: 'members',
    child: [
      { path: BASEDIR + '/zak/teammembers', name: 'Members' },
      { path: BASEDIR + '/zak/add-teammember', name: 'Add Member' },
      /*{ path: BASEDIR+"/zak/delete-teammember", name: "Delete Member"},*/
    ],
  },
  { path: BASEDIR + '/zak/teammembers', component: TeamMember, type: 'child' },
  {
    path: BASEDIR + '/zak/add-teammember',
    component: AddTeamMember,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/delete-teammember',
    component: DeleteTeamMember,
    type: 'child',
  },

  {
    path: '#',
    name: 'Testimonials',
    icon: 'badge',
    type: 'dropdown',
    parentid: 'testimonials',
    child: [
      { path: BASEDIR + '/zak/testimonials', name: 'Testimonials' },
      { path: BASEDIR + '/zak/add-testimonial', name: 'Add Testimonial' },
      /*{ path: BASEDIR+"/zak/delete-testimonial", name: "Delete Testimonial"},*/
    ],
  },
  {
    path: BASEDIR + '/zak/testimonials',
    component: Testimonial,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/add-testimonial',
    component: AddTestimonial,
    type: 'child',
  },
  {
    path: BASEDIR + '/zak/delete-testimonial',
    component: DeleteTestimonial,
    type: 'child',
  },

  {
    path: '#',
    name: 'Clients',
    icon: 'globe-alt',
    type: 'dropdown',
    parentid: 'clients',
    child: [
      { path: BASEDIR + '/zak/clients', name: 'Clients' },
      { path: BASEDIR + '/zak/add-client', name: 'Add Client' },
      /*{ path: BASEDIR+"/zak/delete-client", name: "Delete Client"},*/
    ],
  },
  { path: BASEDIR + '/zak/clients', component: Client, type: 'child' },
  { path: BASEDIR + '/zak/add-client', component: AddClient, type: 'child' },
  {
    path: BASEDIR + '/zak/delete-client',
    component: DeleteClient,
    type: 'child',
  },

  {
    path: '#',
    name: 'Contacts',
    icon: 'emotsmile',
    type: 'dropdown',
    parentid: 'contacts',
    child: [
      { path: BASEDIR + '/zak/contacts', name: 'Contacts' },
      { path: BASEDIR + '/zak/add-contact', name: 'Add Contact' },
      /*{ path: BASEDIR+"/zak/delete-contact", name: "Delete Contact"},*/
    ],
  },
  { path: BASEDIR + '/zak/contacts', component: Contact, type: 'child' },
  { path: BASEDIR + '/zak/add-contact', component: AddContact, type: 'child' },
  {
    path: BASEDIR + '/zak/delete-contact',
    component: DeleteContact,
    type: 'child',
  },

  {
    path: '#',
    name: 'Faqs',
    icon: 'question',
    type: 'dropdown',
    parentid: 'faqs',
    child: [
      { path: BASEDIR + '/zak/faqs', name: 'Faqs' },
      { path: BASEDIR + '/zak/add-faq', name: 'Add Faq' },
      /*{ path: BASEDIR+"/zak/delete-faq", name: "Delete Faq"},*/
    ],
  },
  { path: BASEDIR + '/zak/faqs', component: Faq, type: 'child' },
  { path: BASEDIR + '/zak/add-faq', component: AddFaq, type: 'child' },
  { path: BASEDIR + '/zak/delete-faq', component: DeleteFaq, type: 'child' },

  {
    path: '#',
    name: 'Access Pages',
    icon: 'key',
    type: 'dropdown',
    parentid: 'accesspages',
    child: [
      { path: BASEDIR + '/login', name: 'Login' },
      { path: BASEDIR + '/register', name: 'Registration' },
      { path: BASEDIR + '/lockscreen', name: 'Lock Screen' },
      { path: BASEDIR + '/forgotpassword', name: 'Forgot Password' },
      { path: BASEDIR + '/resetpassword', name: 'Reset Password' },
      { path: BASEDIR + '/logout', name: 'Logout' },
    ],
  },

  { path: BASEDIR + '/login', component: Login, type: 'child' },
  { path: BASEDIR + '/lockscreen', component: LockScreen, type: 'child' },
  { path: BASEDIR + '/register', component: Register, type: 'child' },
  { path: BASEDIR + '/resetpassword', component: ResetPassword, type: 'child' },
  {
    path: BASEDIR + '/forgotpassword',
    component: ForgotPassword,
    type: 'child',
  },
  { path: BASEDIR + '/logout', component: Logout, type: 'child' },

  // {
  // 	path: "#",
  // 	name: "Comments",
  // 	icon: "user",
  // 	type: "dropdown",
  // 	parentid: "comments",
  // 	child: [
  // 		{ path: BASEDIR + "/zak/comments", name: "Comments" },
  // 		{ path: BASEDIR + "/zak/add-comment", name: "Add Comment" },
  // 		/*{ path: BASEDIR+"/zak/delete-comment", name: "Delete Comment"},*/
  // 	],
  // },
  // { path: BASEDIR + "/zak/comments", component: Comment, type: "child" },
  // { path: BASEDIR + "/zak/add-comment", component: AddComment, type: "child" },
  // { path: BASEDIR + "/zak/delete-comment", component: DeleteComment, type: "child" },

  {
    redirect: true,
    path: BASEDIR + '/app',
    pathTo: BASEDIR + '/zak/dashboard',
    name: 'Zak Dashboard',
  },
  {
    redirect: true,
    path: BASEDIR + '/app/',
    pathTo: BASEDIR + '/zak/dashboard',
    name: 'Zak Dashboard',
  },
  {
    redirect: true,
    path: BASEDIR + '/',
    pathTo: BASEDIR + '/zak/dashboard',
    name: 'Zak Dashboard',
  },
  {
    redirect: true,
    path: '/',
    pathTo: BASEDIR + '/zak/dashboard',
    name: 'Zak Dashboard',
  },
]
export default dashRoutes
