import shell from 'shell';
import child from 'child_process';
import fs from 'fs';
const app = require('remote').require('app');

const dataPath = app.getPath('userData');

var register = {};

register._writeDesktopFile = cb => {
    var powderPath = process.execPath.substr(0,process.execPath.lastIndexOf("/")+1);
    fs.writeFile(dataPath+'/powder.desktop', '[Desktop Entry]\nVersion=1.0\nName=Powder Player\nComment=Powder Player is a hybrid between a Torrent Client and a Player (torrent streaming)\nExec='+process.execPath+' %U\nPath='+powderPath+'\nIcon='+powderPath+'icon.png\nTerminal=false\nType=Application\nMimeType=application/x-bittorrent;x-scheme-handler/magnet;x-scheme-handler/pow;video/avi;video/msvideo;video/x-msvideo;video/mp4;video/x-matroska;video/mpeg;\n', cb);
};

register.torrent = () => {
    if (process.platform == 'linux') {
        this._writeDesktopFile(err => {
            if (err) throw err;
            var desktopFile = dataPath+'/powder.desktop';
            var tempMime = 'application/x-bittorrent';
            child.exec('gnome-terminal -x bash -c "echo \'Associating Files or URls with Applications requires Admin Rights\'; echo; sudo echo; sudo echo \'Authentication Successful\'; sudo echo; sudo mv -f '+desktopFile+' /usr/share/applications; sudo xdg-mime default powder.desktop '+tempMime+'; sudo gvfs-mime --set '+tempMime+' powder.desktop; echo; echo \'Association Complete! Press any key to close ...\'; read" & disown');
        });
    } else if (process.platform == 'darwin') {
        var powderPath = process.execPath.substr(0,process.execPath.lastIndexOf("/")+1)+"../../../../Resources/app.nw/";
        child.exec('"'+powderPath+'src/duti/duti" -s media.powder.player .torrent viewer');
        alert("Successfully Associated with Torrent Files");
    } else {
        fs.writeFile(dataPath+'\\register-torrent.reg', 'REGEDIT4\r\n[HKEY_CURRENT_USER\\Software\\Classes\\powder.player.v1\\DefaultIcon]\r\n@="'+process.execPath.split("\\").join("\\\\")+'"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\powder.player.v1\\shell\\open\\command]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\" \\"%1\\""\r\n[HKEY_CURRENT_USER\\Software\\Classes\\.torrent]\r\n@="powder.player.v1"\r\n"Content Type"="application/x-bittorrent"', err => {
            if (err) throw err;
            shell.openItem(dataPath+'\\register-torrent.reg');
        });
    }
};

register.videos = () => {
    if (process.platform == 'linux') {
        this._writeDesktopFile(err => {
            if (err) throw err;
            var desktopFile = dataPath+'/powder.desktop';
            var tempMimes = ['video/avi','video/msvideo','video/x-msvideo','video/mp4','video/x-matroska','video/mpeg'];
            var tempString = '';
            tempMimes.forEach(el => {
                tempString += '; sudo xdg-mime default powder.desktop '+el+'; sudo gvfs-mime --set '+el+' powder.desktop';
            });
            child.exec('gnome-terminal -x bash -c "echo \'Associating Files or URls with Applications requires Admin Rights\'; echo; sudo echo; sudo echo \'Authentication Successful\'; sudo echo; sudo mv -f '+desktopFile+' /usr/share/applications'+tempString+'; echo; echo \'Association Complete! Press any key to close ...\'; read" & disown');
        });
    } else if (process.platform == 'darwin') {
        var powderPath = process.execPath.substr(0,process.execPath.lastIndexOf("/")+1)+"../../../../Resources/app.nw/";
        child.exec('"'+powderPath+'src/duti/duti" -s media.powder.player .mkv viewer');
        child.exec('"'+powderPath+'src/duti/duti" -s media.powder.player .avi viewer');
        child.exec('"'+powderPath+'src/duti/duti" -s media.powder.player .mp4 viewer');
        child.exec('"'+powderPath+'src/duti/duti" -s media.powder.player .mpg viewer');
        child.exec('"'+powderPath+'src/duti/duti" -s media.powder.player .mpeg viewer');
        alert("Successfully Associated with Video Files");
    } else {
        fs.writeFile(dataPath+'\\register-videos.reg', 'REGEDIT4\r\n[HKEY_CURRENT_USER\\Software\\Classes\\powder.player.v1\\DefaultIcon]\r\n@="'+process.execPath.split("\\").join("\\\\")+'"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\powder.player.v1\\shell\\open\\command]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\" \\"%1\\""\r\n[HKEY_CURRENT_USER\\Software\\Classes\\.avi]\r\n@="powder.player.v1"\r\n"Content Type"="video/avi"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\.mkv]\r\n@="powder.player.v1"\r\n"Content Type"="video/x-matroska"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\.mp4]\r\n@="powder.player.v1"\r\n"Content Type"="video/mp4"', err => {
            if (err) throw err;
            shell.openItem(dataPath+'\\register-videos.reg'); 
        });
    }
};

register.magnet = () => {
    if (process.platform == 'linux') {
        this._writeDesktopFile(err => {
            if (err) throw err;
            var desktopFile = dataPath+'/powder.desktop';
            var tempMime = 'x-scheme-handler/magnet';
            child.exec('gnome-terminal -x bash -c "echo \'Associating Files or URls with Applications requires Admin Rights\'; echo; sudo echo; sudo echo \'Authentication Successful\'; sudo echo; sudo mv -f '+desktopFile+' /usr/share/applications; sudo xdg-mime default powder.desktop '+tempMime+'; sudo gvfs-mime --set '+tempMime+' powder.desktop; echo; echo \'Association Complete! Press any key to close ...\'; read" & disown');
        });
    } else if (process.platform == 'darwin') {
        var powderPath = process.execPath.substr(0,process.execPath.lastIndexOf("/")+1)+"../../../../Resources/app.nw/";
        child.exec('"'+powderPath+'src/duti/duti" -s media.powder.player magnet');
        alert("Successfully Associated with Magnet Links");
    } else {
        fs.writeFile(dataPath+'\\register-magnet.reg', 'REGEDIT4\r\n[HKEY_CLASSES_ROOT\\Magnet]\r\n@="URL:magnet Protocol"\r\n"Content Type"="application/x-magnet"\r\n"URL Protocol"=""\r\n\[HKEY_CLASSES_ROOT\\Magnet\\DefaultIcon]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\"\r\n[HKEY_CLASSES_ROOT\\Magnet\\shell]\r\n[HKEY_CLASSES_ROOT\\Magnet\\shell\\open]\r\n[HKEY_CLASSES_ROOT\\Magnet\\shell\\open\\command]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\" \\"%1\\""\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet]\r\n@="URL:magnet Protocol"\r\n"Content Type"="application/x-magnet"\r\n"URL Protocol"=""\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet\\DefaultIcon]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet\\shell]\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet\\shell\\open]\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet\\shell\\open\\command]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\" \\"%1\\""', err => {
            if (err) throw err;
            shell.openItem(dataPath+'\\register-magnet.reg'); 
        });
    }
};

register.powLinks = () => {
    if (process.platform == 'linux') {
        this._writeDesktopFile(err => {
            if (err) throw err;
            var desktopFile = dataPath+'/powder.desktop';
            var tempMime = 'x-scheme-handler/pow';
            child.exec('gnome-terminal -x bash -c "echo \'Associating Files or URls with Applications requires Admin Rights\'; echo; sudo echo; sudo echo \'Authentication Successful\'; sudo echo; sudo mv -f '+desktopFile+' /usr/share/applications; sudo xdg-mime default powder.desktop '+tempMime+'; sudo gvfs-mime --set '+tempMime+' powder.desktop; echo; echo \'Association Complete! Press any key to close ...\'; read" & disown');
        });
    } else if (process.platform == 'darwin') {
        var powderPath = process.execPath.substr(0,process.execPath.lastIndexOf("/")+1)+"../../../../Resources/app.nw/";
        child.exec('"'+powderPath+'src/duti/duti" -s media.powder.player pow');
    }
};

module.exports = register;