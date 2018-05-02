@echo off
more +14 "%~f0" >oracle.sql
sqlplus gpsv4/njtynjty@//218.2.168.210:1521/orcl @oracle.sql
echo 数据读取成功
net start MongoDB
mongoimport --db busi_run --type csv --headerline --ignoreBlanks --drop --file output.csv
rem node G:\毕设\work\aggregate\mapreduce.js
net stop MongoDB
del oracle.sql
pause
rem del output.csv
echo 操作完成
pause
goto :eof

spool output.csv;
set heading off;
set pagesize 0;
set termout off;
set trimspool on;
set feedback off;
select 'CPHM,SCWD,SCJD,SCSJ' from t_busi_run where rownum = 1 union select CPHM||','||SCWD||','||SCJD||','||to_char(SCSJ,'yyyy-mm-dd hh24:mi:ss') from t_busi_run where CPHM is not null and scwd is not null and scjd is not null and scsj is not null and scsj > sysdate - interval '7' day;
spool off;
exit;

REM utl_raw.cast_to_raw(DBMS_OBFUSCATION_TOOLKIT.MD5(INPUT_STRING => T_BUSI_RUN.CPHM))