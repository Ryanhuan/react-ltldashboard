-- Table:Auth
-- Description: auth 　　　　　


CREATE TABLE Auth
(
	email		character varying UNIQUE,		--email
	password	character varying,			--password
			
	cr_date   	character varying(7),               -- 資料建立日期
	up_date   	character varying(7),               -- 資料異動日期
	op_user   	character varying(10),              -- 資料異動人員
	login_date  character varying(7),         	-- 登入日期
	IsEnable	boolean,         				-- 是否啟用
	
	guid uuid not null DEFAULT uuid_generate_v4() 	--guid資料主鍵值
	
);

CREATE INDEX idx_Auth ON Auth(email);





