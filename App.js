import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import last from 'lodash.last';

export default function App() {
  const [filePath, setFilePath] = useState('');
  const [percentage, setPercentage] = useState(0);

  const videoUrl =
    'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4';
  let filename = last(videoUrl.split('/'));
  let path_name = `${RNFS.DocumentDirectoryPath}/${filename}`;

  const checkVideoFileExists = () => {
    RNFS.exists(path_name).then((exists) => {
      if (exists) {
        console.log('[*] File Already Exists!!');
        setFilePath(path_name);
      }
    });
  };

  const downloadProgress = (response) => {
    const percentage = Math.floor(
      (response.bytesWritten / response.contentLength) * 100,
    );
    console.log('[*] Download is ' + percentage + '% DONE!');
    setPercentage(percentage);
  };

  const downloadBegin = (response) => {
    var jobId = response.jobId;
    console.log('[*] Start Download! JobId: ' + jobId);
  };

  const downloadVideoFile = () => {
    RNFS.downloadFile({
      fromUrl: videoUrl,
      toFile: path_name.replace(/%20/g, '_'),
      background: true,
      progress: downloadProgress,
      begin: downloadBegin,
    })
      .promise.then((res) => {
        console.log('[*] File Downloaded', res);
        setFilePath(path_name);
      })
      .catch((err) => {
        console.log('\t\t[-] ERROR!!! downloadFile', err.message);
      });
  };

  const removeVideoFile = () => {
    RNFS.unlink(filePath)
      .then(() => {
        setFilePath('');
        console.log('[*] Deleted!!');
      })
      .catch((err) => {
        console.log('\t\t[-] ERROR!!! delete file', err.message);
      });
  };

  useEffect(() => {
    checkVideoFileExists();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <Text>[ FilePath ] {filePath}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={removeVideoFile}>
        <Text style={styles.buttonText}>REMOVE</Text>
      </TouchableOpacity>
      <Video
        style={styles.backgroundVideo}
        source={{
          uri: filePath || videoUrl,
        }}
        volume={1}
        muted={false}
        ignoreSilentSwitch={null}
        fullscreen={true}
        repeat={false}
        //   controls={true}
      />
      <TouchableOpacity style={styles.button} onPress={downloadVideoFile}>
        <Text style={styles.buttonText}>DOWNLOAD</Text>
      </TouchableOpacity>
      <View>
        <Text>Pregress: {percentage} %</Text>
      </View>
      <View style={{ marginTop: 50 }}>
        <Text>[ VideoUrl ] {videoUrl}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  backgroundVideo: {
    position: 'relative',
    width: 300,
    height: 200,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'rgb(140, 140, 140)',
    fontSize: 12,
  },
});
