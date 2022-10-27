--資料表中文名稱：原物料
--資料表英文名稱：materials
--資料庫用戶名稱：ltl 　　　　　　


-- DROP TABLE materials;

CREATE TABLE materials
(
	id 		character varying not null,		--id 
	type		character varying(50),			--類別 code_type:'ma_type'
	name		character varying(50),			--品名
	size		character varying(50),			--尺寸		
	quality	character varying(50),			--質地 code_type:'ma_quality'
	price		double precision,				--價錢
	num		double precision,				--個數，數量
	price_per	double precision,				--單價
	store_name	character varying(50),			--店家
	memo		character varying(100),			--備註
	
	cr_date   character varying(7),                 -- 資料建立日期
	up_date   character varying(7),                 -- 資料異動日期
	op_user   character varying(100),               -- 資料異動人員
	
	guid uuid not null DEFAULT uuid_generate_v4()	--guid資料主鍵值
	

);

CREATE INDEX idx_materials ON materials (id,type);
ALTER TABLE materials ADD CONSTRAINT UK UNIQUE (id);




