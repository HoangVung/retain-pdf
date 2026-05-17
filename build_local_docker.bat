@echo off
set VERSION_TAG=v1.0.0-local
set PUSH_LATEST=0
set REGISTRY_USER=local

echo [1/2] Dang build RetainPDF App Image...
docker build -f docker\Dockerfile.app -t %REGISTRY_USER%/retainpdf-app:%VERSION_TAG% .

echo [2/2] Dang build RetainPDF Web Image...
docker build -f docker\Dockerfile.web -t %REGISTRY_USER%/retainpdf-web:%VERSION_TAG% .

echo ========================================================
echo Qua trinh build Image hoan tat! Ban co the chay bang lenh:
echo.
echo docker run -d -p 8080:8080 %REGISTRY_USER%/retainpdf-app:%VERSION_TAG%
echo docker run -d -p 3000:3000 %REGISTRY_USER%/retainpdf-web:%VERSION_TAG%
echo ========================================================
pause