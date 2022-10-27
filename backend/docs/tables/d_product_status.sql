--資料表中文名稱：附表_商品狀態
--資料表英文名稱：d_product_status
--相關資料表:(主表)publiccode
--資料庫用戶名稱：ltl 　　　　　　　


-- DROP TABLE d_product_status;

CREATE TABLE d_product_status
(	
	status_name		character varying(20),			--狀態名
	isSale		boolean,					--是否出售(是否有庫存)
	isDate		boolean,					--是否有日期
	isDateDuring	boolean,					--是否有日期區間

	
	guid uuid not null DEFAULT uuid_generate_v4() 		--guid資料主鍵值

);

CREATE INDEX idx_d_product_status ON d_product_status(status_name);





