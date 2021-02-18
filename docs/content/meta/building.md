---
title: Building
weight: 0
type: building
toc : true
---
CEF Detailed instructions 

https://bitbucket.org/chromiumembedded/cef/wiki/BranchesAndBuilding.md
 
 
 

Looks like the archvie is broken as it point to the new build.
https://developer.microsoft.com/en-us/windows/downloads/sdk-archive

Here is direct link to the download
Download Windows 10 SDK 10.0.14393.33 http://download.microsoft.com/download/6/3/B/63BADCE0-F2E6-44BD-B2F9-60F5F073038E/standalonesdk/sdksetup.exe

Download Windows 10 SDK 10.0.14393.33 http://download.microsoft.com/download/6/3/B/63BADCE0-F2E6-44BD-B2F9-60F5F073038E/standalonesdk/sdksetup.exe

# Building dependenceis
https://bitbucket.org/chromiumembedded/cef/wiki/MasterBuildQuickStart#markdown-header-linux-setup


https://groups.google.com/a/chromium.org/forum/#!topic/chromium-dev/LHbKDRITc2A%5B1-25%5D
'''
DEPOT_TOOLS_WIN_TOOLCHAIN = 0
'''


https://msdn.microsoft.com/en-us/library/windows/desktop/aa385638(v=vs.85).aspx

'''

[9/27741] ACTION //base/win:eventlog_messages(//build/toolchain/win:x86)
FAILED: gen/base/win/eventlog_messages.h gen/base/win/eventlog_messages.rc
C:/code/depot_tools/python276_bin/python.exe ../../build/win/message_compiler.py environment.x86 -h gen/base/win -r gen/base/win -u ../../base/win/eventlog_messages.mc
'mc.exe' is not recognized as an internal or external command,
operable program or batch file.

[16/27741] CXX obj/base/base_paths/base_paths_win.obj
ninja: build stopped: subcommand failed.

'''

Edit and comment line `824` 
```
// #include "bits10_1.h"
```


```
c:\code\chromium_git\chromium\src>ninja -C out\Debug_GN_x86 cef
ninja: Entering directory `out\Debug_GN_x86'
[7/14320] CXX obj/components/update_client/update_client/background_downloader_win.obj
FAILED: obj/components/update_client/update_client/background_downloader_win.obj
ninja -t msvc -e environment.x86 -- "C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\BIN\amd64_x86/cl.exe" /nologo /showIncludes /FC @obj/components/update_client/update_client/background_downloader_win.obj.rsp /c ../../components/update_client/background_downloader_win.cc /Foobj/components/update_client/update_client/background_downloader_win.obj /Fd"obj/components/update_client/update_client_cc.pdb"
c:\program files (x86)\windows kits\10\include\10.0.15063.0\um\bits5_0.h(824): fatal error C1083: Cannot open include file: 'bits10_1.h': No such file or directory
[11/14320] CXX obj/components/update_client/update_client/crx_downloader.obj
FAILED: obj/components/update_client/update_client/crx_downloader.obj
ninja -t msvc -e environment.x86 -- "C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\BIN\amd64_x86/cl.exe" /nologo /showIncludes /FC @obj/components/update_client/update_client/crx_downloader.obj.rsp /c ../../components/update_client/crx_downloader.cc /Foobj/components/update_client/update_client/crx_downloader.obj /Fd"obj/components/update_client/update_client_cc.pdb"
c:\program files (x86)\windows kits\10\include\10.0.15063.0\um\bits5_0.h(824): fatal error C1083: Cannot open include file: 'bits10_1.h': No such file or directory
[16/14320] CXX obj/components/variations/service/service/variations_service.obj
ninja: build stopped: subcommand failed.
```



../components/update_client/crx_downloader.cc /Foobj/components/update_client/update_client/crx_downloader.obj /Fd"obj/components/update_client/update_client_cc.pdb"
c:\program files (x86)\windows kits\10\include\10.0.15063.0\um\bits5_0.h(824): fatal error C1083: Cannot open include file: 'bits10_1.h': No such file or directory
[10/14237] ACTION //components/resources:about_credits(//build/toolchain/win:x86)



C:\code\depot_tools;C:\ProgramData\Oracle\Java\javapath;D:\tools\unixtools\usr\local\wbin;C:\Program Files\Java\jdk1.7.0_21\bin;c:\Windows\system32;D:\tools\apache-maven-3.0.2\bin;D:\servers\mongodb-win32-x86_64-2.0.1\bin;C:\Program Files (x86)\Git~~~~\bin;D:\tools\depot_tools;C:\MinGW\bin;C:\Program Files\MATLAB\R2012a\runtime\win64;C:\Program Files\MATLAB\R2012a\bin;C:\Program Files (x86)\ATI Technologies\ATI.ACE\Core-Static;C:\Program Files\TortoiseSVN\bin;C:\Program Files (x86)\CMake 2.8\\bin;C:\Program Files (x86)\Microsoft SQL Server\100\Tools\Binn\;C:\Program Files\Microsoft SQL Server\100\Tools\Binn\;C:\Program Files\Microsoft SQL Server\120\Tools\Binn\;C:\python35\;C:\Program Files (x86)\Skype\Phone\;C:\Program Files\nodejs\;c:\cygwin\bin;C:\Program Files\Microsoft SQL Server\120\DTS\Binn\;C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\110\Tools\Binn\;C:\Program Files (x86)\Microsoft SQL Server\120\Tools\Binn\;C:\Program Files (x86)\Microsoft SQL Server\120\DTS\Binn\;C:\Program Files (x86)\Microsoft SQL Server\120\Tools\Binn\ManagementStudio\;C:\Program Files (x86)\GtkSharp\2.12\bin;C:\Program Files (x86)\NVIDIA Corporation\PhysX\Common;%HUGO_HOME%;%systemroot%\System32\WindowsPowerShell\v1.0\;C:\Program Files\Git\cmd;C:\Program Files\Git\mingw64\bin;C:\Program Files\Git\usr\bin;C:\Program Files\Microsoft SQL Server\130\Tools\Binn\;%systemroot%\System32\WindowsPowerShell\v1.0\;C:\Program Files\dotnet\

C:\code\depot_tools;C:\ProgramData\Oracle\Java\javapath;D:\tools\unixtools\usr\local\wbin;C:\Program Files\Java\jdk1.7.0_21\bin;c:\Windows\system32;D:\tools\apache-maven-3.0.2\bin;C:\Program Files (x86)\Git~~~~\bin;C:\MinGW\bin;C:\Program Files\MATLAB\R2012a\runtime\win64;C:\Program Files\MATLAB\R2012a\bin;C:\Program Files (x86)\ATI Technologies\ATI.ACE\Core-Static;C:\Program Files\TortoiseSVN\bin;C:\Program Files (x86)\CMake 2.8\bin;C:\Program Files (x86)\Microsoft SQL Server\100\Tools\Binn\;C:\Program Files\Microsoft SQL Server\100\Tools\Binn\;C:\Program Files\Microsoft SQL Server\120\Tools\Binn\;C:\python35\;C:\Program Files (x86)\Skype\Phone\;C:\Program Files\nodejs\;c:\cygwin\bin;C:\Program Files\Microsoft SQL Server\120\DTS\Binn\;C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\110\Tools\Binn\;C:\Program Files (x86)\Microsoft SQL Server\120\Tools\Binn\;C:\Program Files (x86)\Microsoft SQL Server\120\DTS\Binn\;C:\Program Files (x86)\Microsoft SQL Server\120\Tools\Binn\ManagementStudio\;C:\Program Files (x86)\GtkSharp\2.12\bin;C:\Program Files (x86)\NVIDIA Corporation\PhysX\Common;%HUGO_HOME%;%systemroot%\System32\WindowsPowerShell\v1.0\;C:\Program Files\Git\cmd;C:\Program Files\Git\mingw64\bin;C:\Program Files\Git\usr\bin;C:\Program Files\Microsoft SQL Server\130\Tools\Binn\;%systemroot%\System32\WindowsPowerShell\v1.0\;C:\Program Files\dotnet\;%WIN_SDK%\bin

c:\code\chromium_git\chromium\src>ninja -C out\Debug_GN_x64 cef






ADD Windows SDK To the ClassPath
C:\Users\Greg>cd c:\code\chromium_git\chromium\src

c:\code\chromium_git\chromium\src>ninja -C out\Debug_GN_x64 cef
ninja: Entering directory `out\Debug_GN_x64'
[1/27710] ACTION //base/win:eventlog_messages(//build/toolchain/win:x64)
FAILED: gen/base/win/eventlog_messages.h gen/base/win/eventlog_messages.rc
C:/code/depot_tools/python276_bin/python.exe ../../build/win/message_compiler.py environment.x64 -h gen/base/win -r gen/base/win -u ../../base/win/eventlog_messages.mc
'mc.exe' is not recognized as an internal or external command,
operable program or batch file.

[2/27710] ACTION //base/trace_event/etw_manifest:chrome_events_win(//build/toolchain/win:x64)
FAILED: gen/base/trace_event/etw_manifest/chrome_events_win.h gen/base/trace_event/etw_manifest/chrome_events_win.rc
C:/code/depot_tools/python276_bin/python.exe ../../build/win/message_compiler.py environment.x64 -h gen/base/trace_event/etw_manifest -r gen/base/trace_event/etw_manifest -u -um ../../base/trace_event/etw_manifest/chrome_events_win.man
'mc.exe' is not recognized as an internal or external command,
operable program or batch file.





Generating Intial Solution for CEF

D:\dev\gbltech\phantomsql\engine\deps\cef>cmake -G "Visual Studio 14 2015 Win64"

