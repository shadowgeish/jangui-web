'''
Created on 24 janv. 2016

@author: serge
'''
import tornado.ioloop
import tornado.web
import os
import pydjanguee.database as dbt
import smtplib
from email.mime.text import MIMEText
import random
import string
import pydjanguee.database as db
import pydjanguee.tools as tools
from torndsession.sessionhandler import SessionBaseHandler
from enum import Enum

dirname = os.path.join(os.path.dirname(__file__),'WebContent')
db_user = 'root'
db_password = 'cameroun'
db_host = 'localhost'
db_name = 'djanguee_db'

class CheckEmail(SessionBaseHandler):
    
    def id_generator(self,size=6, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))
    
    def get(self):
        email = format(self.get_argument('email',None))
        print(email)
        con = db.get_connection(db_user,db_password,db_host,db_name)
        df = db.run_query(con,'SELECT count(*) as ct FROM djanguee_db.members where email = %s', [email] )
        con.close()
        if df['ct'][0] == 0:
            strid = self.id_generator()
            print(strid)
            msg = MIMEText(strid)
            msg['Subject'] = 'Djanguee:validation email Code'
            msg['From'] = 'noreply@djanguee.com'
            msg['To'] = email
            
            s = smtplib.SMTP('smtp.gmail.com', 587)
            s.starttls()
            s.login("djanguee@gmail.com", "djanguee1234")
            s.sendmail('noreply@djanguee.com', [email], msg.as_string())
            s.quit()
            self.session['email_code'] = strid
            self.session['email'] = email
        
        self.write('{"email":"'+ email  +'", "available":' + format(df['ct'][0]) + '}')
        
class InfoType(Enum):
    CREATION = 'CREATION'
    UPDATE = 'UPDATE'
    START = 'START'
    NEW_MEMBER = 'NEW_MEMBER'

class MemberType(Enum):
    ADMIN = 'ADMIN'
    REGULAR = 'REGULAR'

class RequestType(Enum):
    JOIN_DJANGUEE = 'JOIN_DJANGUEE'
    CASH_APPROVAL = 'CASH_APPROVAL'
    
class RequestStatus(Enum):
    NEW = 'NEW'
    CLOSED = 'CLOSED'
    ACCEPTED = 'ACCEPTED'
    REJECTED = 'REJECTED'

class   CreateDjanguee(SessionBaseHandler):
    def get(self):
        name = format(self.get_argument('name',None))
        creator_id = self.session['user_id']
        limit_payment_day = format(self.get_argument('day',None))
        max_nb_member = format(self.get_argument('number',None))
        rate = format(self.get_argument('rate',None))
        djanguee_type = format(self.get_argument('type',None))
        rotation_initial = format(self.get_argument('rotation',None))
        amount = format(self.get_argument('payment',None))
        is_searchable = format(self.get_argument('is_searchable',None))

        #if self.session['email_code'] is None:
        #    self.render(os.path.join(dirname,"pages-login.html"))
        #elif self.session['email_code'] == email_check_code:
        #sent_email = ""
        con = db.get_connection(db_user,db_password,db_host,db_name)
        #df = db.run_query(con,'SELECT count(*) as ct FROM djanguee_db.members where email = %s', [email] )
        #if df['ct'][0] == 0:
        id = db.run_insert_query(con,""" INSERT INTO `djanguee_db`.`djanguee`
                                    (
                                    `create_date`,
                                    `update_date`,
                                    `name`,
                                    `creator_id`,
                                    `limit_payment_day`,
                                    `max_nb_member`,
                                    `rate`,
                                    `djanguee_type`,
                                    `rotation_initial`,
                                    `amount`,
                                    `is_searchable`)
                                    VALUES
                                    (
                                    now(),
                                    now(),
                                    %s,
                                    %s,
                                    %s,
                                    %s,
                                    %s,
                                    %s,
                                    %s,
                                    %s,
                                    %s);
                                """, [name,str(self.session['user_id']),str(limit_payment_day),str(max_nb_member),str(rate),str(djanguee_type),str(rotation_initial),str(amount),str(is_searchable)] )
        
        db.run_insert_query(con,""" INSERT INTO `djanguee_db`.`d_infos`
                                    (
                                    `create_date`,
                                    `djanguee_id`,
                                    `info_type`,
                                    `member_id`)
                                    VALUES
                                    (
                                    now(),
                                    %s,
                                    %s,
                                    %s);
                                """, [id,str(InfoType.CREATION.value), str(self.session['user_id'])] )
        
        db.run_insert_query(con,""" INSERT INTO `djanguee_db`.`djanguee_members`
                                    (
                                    `member_id`,
                                    `djanguee_id`,
                                    `member_type`,
                                    `creation_date`)
                                    VALUES
                                    (
                                    %s,
                                    %s,
                                    %s,
                                    now());
                                """, [str(self.session['user_id']),id,str(MemberType.ADMIN.value)] )
        
        
        con.close()
            #    self.write('{"email":"'+ email  +'", "inserted":' + format(id   ) + ', "email_code":1, "email_code_match":1, "already_exist":0}')
            #else:
            #    con.close()
            #    self.write('{"email":"'+ email  +'", "inserted":0, "email_code":1, "email_code_match":1, "already_exist":1}')
                
    #elif self.session['email_code'] != email_check_code:
    #        self.write('{"email":"'+ email  +'", "inserted":0, "email_code":1, "email_code_match":0, "already_exist":0}')
    #    else:
        self.write('{"success":1, "inserted": ' + format(id) +'}')

class RegisterUser(SessionBaseHandler):
    def get(self):
        email = format(self.get_argument('email',None))
        password = format(self.get_argument('password',None))
        email_check_code = format(self.get_argument('email_check_code',None))
        firstName = format(self.get_argument('firstName',None))
        gender = format(self.get_argument('gender',None))
        id=0
        if self.session['email_code'] is None:
            self.write('{"email":"'+ email  +'", "inserted":0, "email_code":0, "email_code_match":0, "already_exist":0}')
        elif self.session['email_code'] == email_check_code:
            sent_email = ""
            con = db.get_connection(db_user,db_password,db_host,db_name)
            df = db.run_query(con,'SELECT count(*) as ct FROM djanguee_db.members where email = %s', [email] )
            if df['ct'][0] == 0:
                id = db.run_insert_query(con,""" INSERT INTO `djanguee_db`.`members`
                                        (
                                        `create_date`,
                                        `update_date`,
                                        `email`,
                                        `fname`,
                                        `password`,
                                        `gender`)
                                        VALUES
                                        (
                                        now(),
                                        now(),
                                         %s,
                                        %s,
                                         md5(%s),
                                         %s);
                                        """, [email,firstName,password,gender] )
                self.session['email_code'] = email_check_code
                self.session['email'] = email
                self.session['firstName'] = firstName
                self.session['connected'] = 1
                self.session['user_id'] = id
                con.close()
                self.write('{"email":"'+ email  +'", "inserted":' + format(id   ) + ', "email_code":1, "email_code_match":1, "already_exist":0}')
            else:
                con.close()
                self.write('{"email":"'+ email  +'", "inserted":0, "email_code":1, "email_code_match":1, "already_exist":1}')
                
        elif self.session['email_code'] != email_check_code:
            self.write('{"email":"'+ email  +'", "inserted":0, "email_code":1, "email_code_match":0, "already_exist":0}')
        else:
            self.write('{"email":"'+ email  +'", "inserted":0, "email_code":1, "email_code_match":0, "already_exist":1}')
        
            
class LoginHandler(SessionBaseHandler):
    def get(self):
        email = format(self.get_argument('email',None))
        password = format(self.get_argument('password',None))
        self.session['connected'] = None
        if email is not None and password is not None:
            con = db.get_connection(db_user,db_password,db_host,db_name)
            df = db.run_query(con,'SELECT max(id) as id,count(*) as ct FROM djanguee_db.members where email = %s and password=md5(%s)', [email,password] )
            con.close()
            if df['ct'][0] > 0:
                self.session['email'] = email
                self.session['connected'] = 1
                self.session['user_id'] = df['id'][0]
            else:
                self.session['connected'] = None
            print('=====>>>' +  format(df['ct'][0]))
            self.write('{"email":"'+ email  +'", "user_found": ' + format(df['ct'][0]) + '}')
        elif tools.get_dic_item_value(self.session, 'connected' ) is not None:
            self.write('{"email":"'+ email  +'", "user_found": 1}')
        else:
            self.write('{"email":"'+ email  +'", "user_found": 0}')           
        
        
class MainHandler(SessionBaseHandler):
    def get(self):
        if tools.get_dic_item_value(self.session, 'connected' ) is None:
            self.render(os.path.join(dirname,"pages-login.html"))
        else:
            self.render(os.path.join(dirname,"index.html"))
            
class LogOut(SessionBaseHandler):
    def get(self):
        self.session['connected'] = None
        self.render(os.path.join(dirname,"pages-login.html"))  

class RegisterPage(SessionBaseHandler):
    def get(self):
        self.session['connected'] = None
        self.render(os.path.join(dirname,"pages-register.html"))  

class LoginPage(SessionBaseHandler):
    def get(self):
        self.session['connected'] = None
        
        self.render(os.path.join(dirname,"pages-login.html"))  
        
class DjangueeInfos(SessionBaseHandler):
    def get(self):
        djanguee_id = self.get_argument('djanguee_id',None)
        con = db.get_connection(db_user,db_password,db_host,db_name)
        df = db.run_query(con,'select id,fname,sname  from djanguee_db.members where id= %s ',[str(self.session['user_id'])])
        fname = str(df['fname'][0])
        sname = str(df['sname'][0])
        uid =  str(self.session['user_id'])
        if djanguee_id is not None:
            df = db.run_query(con,'select *  from djanguee_db.v_djanguee_perms_all where id = %s',[str(djanguee_id)])
        else:
            df = db.run_query(con,'select * from djanguee_db.v_djanguee_perms_all where member_id = %s',[str(self.session['user_id'])])
        con.close()
        self.write('{"uid":"' + uid +'","ufname":"' + fname +'","usname":"' + sname +'","data":' + df.to_json(orient='records') +  '}')

class InfosList(SessionBaseHandler):
    def get(self):
        djanguee_id = self.get_argument('djanguee_id',None)
        con = db.get_connection(db_user,db_password,db_host,db_name)
        
        df = db.run_query(con,"""
        select  * from v_djanguee_infos
        where djanguee_id = %s
        """,[str(djanguee_id)])
        con.close()
        self.write('{"data":' + df.to_json(orient='records') +  '}')



class RequestList(SessionBaseHandler):
    def get(self):
        djanguee_id = self.get_argument('djanguee_id',None)
        con = db.get_connection(db_user,db_password,db_host,db_name)
        if djanguee_id is not None:
            df = db.run_query(con,""" 
                select dr.id as id,
                    from_infos.id from_id, from_infos.fname as from_fname,
                    to_infos.id to_id, to_infos.fname as to_fname,
                    dr.request_type,
                    dr.request_status,
                    d.name as djanguee_name
                     from djanguee_db.d_request dr 
                    left join djanguee_db.members to_infos 
                    on dr.to = to_infos.id left join djanguee_db.members from_infos 
                    on dr.from = from_infos.id 
                    left join djanguee_db.djanguee d on d.id = dr.djanguee_id
                    where dr.request_status = %s and djanguee_id = %s and to_infos.id = %s
            """,[str(RequestStatus.NEW.value), str(djanguee_id), str(self.session['user_id'])])
        else:
            df = db.run_query(con,""" 
                select dr.id as id,
                    from_infos.id from_id, from_infos.fname as from_fname,
                    to_infos.id to_id, to_infos.fname as to_fname,
                    dr.request_type,
                    dr.request_status,
                    d.name as djanguee_name
                     from djanguee_db.d_request dr 
                    left join djanguee_db.members to_infos 
                    on dr.to = to_infos.id left join djanguee_db.members from_infos 
                    on dr.from = from_infos.id 
                    left join djanguee_db.djanguee d on d.id = dr.djanguee_id
                    where dr.request_status = %s and to_infos.id = %s
            """,[str(RequestStatus.NEW.value), str(self.session['user_id'])])
        con.close()
        self.write('{"data":' + df.to_json(orient='records') +  '}')



class AddDjangueeMember(SessionBaseHandler):
    def get(self):
        djanguee_id = format(self.get_argument('djanguee_id',None))
        creator_id = format(self.get_argument('creator_id',None))
        emails = format(self.get_argument('emails',None))
        emails_list = emails.replace(' ','').split(',')
        emails_list_tag = []
        non_emails_list = []
        for email in emails_list:
            emails_list_tag.append("%s")
        
        print(format(emails_list_tag))
        #str_emails_list =  "'" + "','".join(emails_list) + "'" 
        str_emails_list =  ",".join(emails_list)
        con = db.get_connection(db_user,db_password,db_host,db_name)
        
        df = db.run_query(con,'select email from djanguee_db.members where email in (' + ','.join(emails_list_tag) +') ',emails_list)
        existing_email = df['email'].values.tolist()
        print('existing_email=' + format(existing_email))
        for email in emails_list:
            if email not in existing_email:
                non_emails_list.append(email)
        print('non_emails_list=' + format(non_emails_list))
        if len(non_emails_list) > 0:
            df['email'] = non_emails_list
            con.close()
            self.write('{"emails_status":"0","wrong_emails":"' + ','.join(non_emails_list) +  '"}')
        else:
            #inserting the emails
            args_all = emails_list + [djanguee_id]
            df = db.run_query(con,'select email,m.id as id,member_type from djanguee_db.djanguee_members dm left join djanguee_db.members m on m.id = dm.member_id where email in (' + ','.join(emails_list_tag) +') and djanguee_id = %s',args_all)
            existing_email = df['email'].values.tolist()
            
            print(' existing_email in member list = ' + format(existing_email))
            
            if len(existing_email) == len(emails_list):
                con.close()
                self.write('{"emails_status":"1"}')
            else: 
                args_all = []
                new_emails_list = []
                emails_list_tag = []
                for email in emails_list:
                    if email not in existing_email:
                        new_emails_list.append(email)
                        emails_list_tag.append("%s")
                
                #Request insertion
                args_all = new_emails_list + [djanguee_id]
                
                db.run_insert_query(con,""" update `djanguee_db`.`d_request` dr left join djanguee_db.members m on dr.to = m.id 
                                         set dr.`request_status` = '""" + str(RequestStatus.CLOSED.value) +"""' 
                                           where dr.request_type = '""" + str(RequestType.JOIN_DJANGUEE.value) +"""' m.email in (""" + ','.join(emails_list_tag) +""") and dr.djanguee_id = %s
                                        ;
                                    """, args_all ) 
                
                
                db.run_insert_query(con,""" INSERT INTO `djanguee_db`.`d_request`
                                        (
                                        `from`,
                                        `to`,
                                        `djanguee_id`,
                                        `request_type`,
                                        `creation_date`,
                                        `request_status`
                                        )
                                         select """ + str(creator_id) + """, id, """ + str(djanguee_id) + """, '""" + str(RequestType.JOIN_DJANGUEE.value) +"""' ,now() 
                                         ,'""" + str(RequestStatus.NEW.value) +"""' 
                                          from 
                                        djanguee_db.members  where email in (""" + ','.join(emails_list_tag) +""")
                                        ;
                                    """, new_emails_list )
                con.close()
                self.write('{"emails_status":"1"}')

class AcceptJoinRequest(SessionBaseHandler):
    def get(self):
        request_id = self.get_argument('request_id',None)
        con = db.get_connection(db_user,db_password,db_host,db_name)
        db.run_insert_query(con,""" update `djanguee_db`.`d_request` dr
                                    set dr.`request_status` = %s
                                     where dr.id = %s
                                        ;
                                    """,  [str(RequestStatus.ACCEPTED.value),str(request_id)])
        
        
        db.run_insert_query(con,""" INSERT INTO `djanguee_db`.`d_infos`
                                    (
                                    `create_date`,
                                    `djanguee_id`,
                                    `info_type`,
                                    `member_id`)
                                     select now(),djanguee_id,'""" + str(InfoType.NEW_MEMBER.value) + """','""" + str(self.session['user_id']) + """'  from djanguee_db.d_request
                                    where id = %s;
                                """, [str(request_id)] )
        
        db.run_insert_query(con,""" INSERT INTO `djanguee_db`.`djanguee_members`
                                    (
                                    `member_id`,
                                    `djanguee_id`,
                                    `member_type`,
                                    `creation_date`)
                                    select '""" + str(self.session['user_id']) + """',djanguee_id,'""" + str(MemberType.REGULAR.value)  + """',now()  from djanguee_db.d_request
                                    where id = %s;
                                """, [str(request_id)] )
        
        con.close()
        self.write('{"request_status":"1"}') 

class SendChatMessage(SessionBaseHandler):
    def get(self):
        djanguee_id = format(self.get_argument('djanguee_id',None))
        member_id = format(self.get_argument('member_id',None))
        message = format(self.get_argument('message',None))
        con = db.get_connection(db_user,db_password,db_host,db_name)
        
        db.run_insert_query(con,""" insert into  `djanguee_db`.`chat` 
                                    (
                                    `create_date`,
                                    `receive_date`,
                                    `djanguee_id`,
                                    `sender_id`,
                                    `message`)
                                    values 
                                    (now(), now(), %s, %s, %s)
                                        ;
                                    """,  [str(djanguee_id),str(member_id),str(message)])
        
        con.close()
        self.write('{"request_status":"1"}')

class RejectRequest(SessionBaseHandler):
    def get(self):
        request_id = self.get_argument('request_id',None)
        con = db.get_connection(db_user,db_password,db_host,db_name)
        db.run_insert_query(con,""" update `djanguee_db`.`d_request` dr set
                                    set dr.`request_status` = %s
                                     where dr.id = %s
                                        ;
                                    """,  [str(RequestStatus.REJECTED.value),str(request_id)])
        
        con.close()
        self.write('{"request_status":"1"}') 

class ChatMessage(SessionBaseHandler):
    def get(self):
        djanguee_id = format(self.get_argument('djanguee_id',None))
        con = db.get_connection(db_user,db_password,db_host,db_name)
        df = db.run_query(con,""" select * from  `djanguee_db`.`chat_messages` where djanguee_id = %s
                                    """,  [str(djanguee_id)])
        con.close()
        self.write('{"data":' + df.to_json(orient='records') +  '}')

class GenericTableQuery(SessionBaseHandler):
    def get(self):
        table_name = format(self.get_argument('data',None))
        con = db.get_connection(db_user,db_password,db_host,db_name)
        df = db.run_query(con,'SELECT * FROM djanguee_db. ' + table_name, None)
        con.close()
        self.write('{"data":' + df.to_json(orient='records') +  '}')

def make_app():
    settings = dict(
            debug = False,
            static_path = dirname
    )
    session_settings = dict(
            driver = "file",
            driver_settings = dict(
                host = "#_sessions",
                ),
            force_persistence = True,
    )
    settings.update(session=session_settings)
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/(.*\.css|.*\.js|.*\.png|.*\.woff|.*\.ttf|.*\.woff2)", tornado.web.StaticFileHandler, {"path": os.path.dirname(__file__)}),
        (r"/login", LoginPage),
        (r"/register", RegisterPage),
        (r"/services/register", RegisterUser),
        (r"/services/createDjanguee", CreateDjanguee),
        (r"/services/check_email", CheckEmail),
        (r"/logout", LogOut),
        (r"/services/login", LoginHandler),
        (r"/services/genericTableQuery", GenericTableQuery),
        (r"/services/djanguees", DjangueeInfos),
        (r"/services/djanguees_member_list", DjangueeInfos),
        (r"/services/add_djanguees_member", AddDjangueeMember),
        (r"/services/request_list", RequestList),
        (r"/services/infos_list", InfosList), 
        (r"/services/accept_join_request", AcceptJoinRequest),
        (r"/services/reject_request", RejectRequest),
        (r"/services/chat_message", ChatMessage),   
         (r"/services/send_chat_message", SendChatMessage),      
    ], **settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()