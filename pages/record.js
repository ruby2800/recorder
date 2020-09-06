import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, RefreshControl } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Icon, Slider, Header } from 'react-native-elements';
import Sound from 'react-native-sound';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import historypage from './history';
import RNSiriWaveView from 'react-native-siri-wave-view';



var date = new Date();

var year = date.getFullYear().toString();
var month = (date.getMonth() + 1).toString();
var day = date.getDate().toString();
var hour = date.getHours().toString();
var minute = date.getMinutes().toString();
var second = date.getSeconds().toString();


export default class App extends Component {



    constructor(props) {

        super(props);
        //時間


        this.state = {
            hasPermission: undefined, //授权状态     
            //audioPath: AudioUtils.DocumentDirectoryPath + 'test.aac',  // 文件路径
            //現在他上傳的時間 使用者名稱
            //要尊守規定
            audioPath: AudioUtils.DocumentDirectoryPath + `/name-${year}-${month}-${day}_${hour + minute + second}.awb`,  // 文件路径
            recording: false, //是否录音
            pause: false, //录音是否暂停
            stop: false, //录音是否停止
            resume: false,
            currentTime: 0, //录音时长


        };
    }


    componentDidMount() {


        // 请求授权
        AudioRecorder.requestAuthorization()
            .then(isAuthor => {
                console.log('是否授權: ' + isAuthor)
                if (!isAuthor) {
                    return alert('請前往設定開啟錄音權限')
                }
                this.setState({ hasPermission: isAuthor })
                this.prepareRecordingPath(this.state.audioPath);
                // 录音进展
                AudioRecorder.onProgress = (data) => {
                    let decibels = 10 * Math.log10(data.currentPeakMetering / data.currentMetering) * -0.25
                    this.setState({ currentTime: Math.floor(data.currentTime) });
                };
                // 完成录音
                AudioRecorder.onFinished = (data) => {
                    // data 返回需要上传到后台的录音数据
                    console.log(this.state.currentTime)
                    console.log(this.state.audioPath);
                    //console.log(this.state.whoosh);

                };
            })
    };

    /**
     * AudioRecorder.prepareRecordingAtPath(path,option)
     * 录制路径
     * path 路径
     * option 参数
     */
    prepareRecordingPath = (path) => {
        const option = {
            SampleRate: 16000, //采样率
            Channels: 1, //通道
            AudioQuality: 'High', //音质
            AudioEncoding: 'amr_wb', //音频编码
            OutputFormat: 'amr_wb', //输出格式
            MeteringEnabled: false, //是否计量
            MeasurementMode: false, //测量模式
            AudioEncodingBitRate: 16000, //音频编码比特率
            IncludeBase64: true, //是否是base64格式
            AudioSource: 0, //音频源
        }
        AudioRecorder.prepareRecordingAtPath(path, option)
    }

    // 开始录音
    _record = async () => {

        if (!this.state.hasPermission) {
            return alert('沒有授權')
        }
        if (this.state.recording) {
            return alert('已在錄音中...')
        }
        if (this.state.stop) {
            this.prepareRecordingPath(this.state.audioPath)
        }
        this.setState({ recording: true, pause: false })

        try {
            await AudioRecorder.startRecording()
        } catch (err) {
            console.log(err)
        }
    }

    // 暂停录音
    _pause = async () => {
        if ((!this.state.recording)) {
            return alert('請先按下錄音鍵')
        }

        try {
            await AudioRecorder.pauseRecording()
            this.setState({ pause: true, recording: false })
        } catch (err) {
            console.log(err)
        }
    }

    // 恢复录音
    _resume = async () => {
        if (!this.state.pause) {
            return alert('錄音未暫停')
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({ pause: false, recording: true })
        } catch (err) {
            console.log(err)
        }
    }

    //重新整裡

    forceRemount() {
        console.log("reload");

        date = new Date();

        year = date.getFullYear().toString();
        month = (date.getMonth() + 1).toString();
        day = date.getDate().toString();
        hour = date.getHours().toString();
        minute = date.getMinutes().toString();
        second = date.getSeconds().toString();

        this.setState({

            audioPath: AudioUtils.DocumentDirectoryPath + `/name-${year}-${month}-${day}_${hour + minute + second}.awb`,  // 文件路径
            currentTime: 0, //录音时长
        })

    }

    // 停止录音
    _stop = async () => {
        //要加上去
        const { navigation } = this.props;
        this.setState({ stop: true, recording: false, paused: false });
        // if ((!this.state.recording)) {
        //     return alert('未錄音')
        // }
        try {


            await AudioRecorder.stopRecording();
            this.forceRemount();
            //this.refunction();


            // this._upload;

            navigation.navigate('歷史紀錄', { url: this.state.audioPath, reload: 0 });

        } catch (error) {
            console.log("停止");
            console.error(error);
        }

    }

    render() {
        let { recording, pause, resume, stop, currentTime } = this.state;
        const { navigation } = this.props;

        currentTime = Math.ceil(currentTime);
        let totalHour = parseInt(currentTime / 3600);
        let totalMin = parseInt(currentTime / 60); //总分钟数
        let totalSec = currentTime - totalMin * 60; //秒钟数并判断前缀是否 + '0'
        totalSec = totalSec > 9 ? totalSec : '0' + totalSec;
        totalMin = totalMin > 9 ? totalMin : '0' + totalMin;
        totalHour = totalHour > 9 ? totalHour : '0' + totalHour;

        // if( this.props.route.params.record==0){

        //     this._record;
        //     console.log(this.props.route.params.record)
        // }

        return (

            <View style={{ flex: 1 }}>
                <View style={{ flex: 7, backgroundColor: 'white', justifyContent: 'space-between' }}>

                    <Header
                        placement="left"
                        backgroundColor='#E8E8E8'
                        // containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                        leftComponent={{
                            icon: 'arrowleft', type: 'antdesign', color: 'black',
                            underlayColor: '#3488C0',
                            onPress: () => this.props.navigation.navigate('歷史紀錄')
                        }}

                        centerComponent={{
                            text:
                                recording ? '錄音中' :
                                    pause ? '暫停' : '沒有錄音'

                            ,
                            style: {
                                fontSize: 20,
                                fontWeight: 'bold',
                                fontFamily: 'Fonts.Lato',
                                color: 'black'
                            }
                        }}
                    />

                    <View style={{ flex: 2, justifyContent: 'space-around', alignItems: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name='mic' type='material' color='red' />
                            <Text style={{ fontSize: 40, fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}>{totalHour}:{totalMin}:{totalSec}</Text>
                        </View>


                        {/* <Text style={styles.text} onPress={this._readFile}>上傳 </Text> */}
                    </View>
                </View>

                <View style={{ flex: 1, backgroundColor: '#E8E8E8', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon raised name='pause' type='material' color='red'
                                onPress={this._pause}
                            />
                        </View>
                    </View>
                    <View>
                        {

                            pause ?
                                <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon raised name='adjust' type='material' color='red'
                                            onPress={this._resume}
                                        />
                                    </View>
                                </View>
                                :


                                <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon raised name='controller-record' type='entypo' color='red'
                                            onPress={this._record}
                                        />
                                    </View>
                                </View>


                        }
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon raised name='stop' type='material' color='red'
                                onPress={this._stop}
                            />
                        </View>
                    </View>

                </View>
            </View >

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginVertical: 10,
    }
})