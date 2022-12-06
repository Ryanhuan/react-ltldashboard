--資料表中文名稱：商品列表
--資料表英文名稱：products
--資料庫用戶名稱：ltl 　　　　　　

-- DROP TABLE products;

CREATE TABLE products
(
	sku 			character varying not null,		--sku (webServer編 'catena_belong(三碼)'+'single_belong(三碼)'+流水號(六碼))
	name			character varying(50),			--商品名
	kind			character varying(50),			--商品種類
	size			character varying(50),			--商品尺寸		
	inventory		double precision,				--商品庫存
	status			character varying(50),			--商品狀態		
	catena_belong	character varying(20),			--系列所屬
	single_belong	character varying(20),			--種類所屬
	catena_intro		character varying(50),		--系列所屬介紹
	product_intro	character varying(50),			--種類所屬介紹
	other_intro		character varying(50),			--商品其他介紹
	scheduled_date	character varying(24),			--排定時間 (YYYY-MM-DD hh:mm a )
													-- => (EX: 2022-11-17T19:19:00.000Z == 2022/11/18 03:19 am)
	limit_date_beg	character varying(24),			--起始時間
	limit_date_end	character varying(24),			--結束時間
	product_items_total_price character varying(10),	--商品成本小記
	product_profit	character varying(10),			--商品利潤
	product_price	character varying(10),			--商品價錢
	
	cr_date   character varying(7),                 -- 資料建立日期
	up_date   character varying(7),                 -- 資料異動日期
	op_user   character varying(100),               -- 資料異動人員
	                                              
	guid uuid not null DEFAULT uuid_generate_v4()   --guid資料主鍵值

);

CREATE INDEX idx_products ON products (sku);





