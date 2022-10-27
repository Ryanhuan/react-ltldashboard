-- Table:member
-- Description: member(user and customer) 　　　　　


CREATE TABLE Member
(
	email		character varying UNIQUE,		--email
	displayName	character varying(20),			--姓名
	photoURL	character varying,			--照片

	IsEmailNotification	
			boolean DEFAULT false,			--email 是否驗證
	IsThirdLogin boolean,					--是否第三方登入

	root		character varying,			--權限
	
	cr_date   	character varying(7),               -- 資料建立日期
	up_date   	character varying(7),               -- 資料異動日期
	op_user   	character varying(100),              -- 資料異動人員
	IsEnabled	boolean,         				-- 是否啟用
	
	guid uuid not null DEFAULT uuid_generate_v4() 	--guid資料主鍵值
	
);

CREATE INDEX idx_Member ON Member(email);





