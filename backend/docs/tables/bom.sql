--資料表中文名稱：bom表
--資料表英文名稱：bom(Bill Of Material)
--資料庫用戶名稱：ltl 　　　　　　


-- DROP TABLE bom;

CREATE TABLE bom
(
	id 			character varying not null,			--materials id 
	sku			character varying not null,			--products sku 
	name		character varying(50),				--materials 品名
	size		character varying(50),				--尺寸
	cnt_num		double precision,					--數量
	price_per	double precision,					--單價
		
	cr_date   character varying(7),                 -- 資料建立日期
	up_date   character varying(7),                 -- 資料異動日期
	op_user   character varying(100),               -- 資料異動人員
	
	guid uuid not null DEFAULT uuid_generate_v4()	--guid資料主鍵值
	
);

CREATE INDEX idx_bom ON bom (id,sku);





