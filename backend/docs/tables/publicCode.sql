--資料表中文名稱：公用代碼
--資料表英文名稱：publiccode
--資料庫用戶名稱：ltl 　　　　　　

-- DROP TABLE publiccode;

CREATE TABLE publiccode
(	
	code_type		character varying(20),			--類別
	code_seq1		character varying(20),			--代碼1
	code_seq2		character varying(20),			--代碼2
	code_seq3		character varying(20),			--代碼3
	code_desc1		character varying(50),			--代碼描述1
	code_desc2		character varying(50),			--代碼描述2
	mark			character varying,			--註記
	
	guid uuid not null DEFAULT uuid_generate_v4() 	--guid資料主鍵值

);

CREATE INDEX idx_publiccode ON publiccode(code_type);





