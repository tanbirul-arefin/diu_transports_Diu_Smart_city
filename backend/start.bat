@echo off
setlocal
cd /d "%~dp0"
for /f "usebackq delims=" %%J in (`powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('JAVA_HOME','User')"`) do set "JAVA_HOME=%%J"
if defined JAVA_HOME set "PATH=%JAVA_HOME%\bin;%PATH%"
call mvnw.cmd spring-boot:run
exit /b %ERRORLEVEL%