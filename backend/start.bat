@echo off
setlocal
cd /d "%~dp0"
if exist "%JAVA_HOME%\bin\java.exe" set JAVA_CMD="%JAVA_HOME%\bin\java.exe"
if not defined JAVA_CMD set JAVA_CMD=java
if exist "target\diu-transport-backend-1.0.0.jar" (
  %JAVA_CMD% -jar "target\diu-transport-backend-1.0.0.jar"
) else (
  echo Build the backend first with: mvn clean package
  exit /b 1
)