import React, { Component, Fragment }from 'react'
import { View, Alert, Text, TouchableOpacity, TextInput, Image, StyleSheet} from 'react-native'
import { Header } from 'react-native-elements';
// import { CheckBox } from 'react-native-elements'
import { Input,Icon } from 'react-native-elements';
import { Button } from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { sha256 } from 'react-native-sha256';
import AsyncStorage from '@react-native-community/async-storage';
import { HelperText } from 'react-native-paper';
// import { useState } from 'react';

class Inputs extends Component {
   //React.Component
   constructor(props) {
 
      super(props)
   
      this.state = {
   
        TextInputEmail: '',
        TextInputPassword: '',
        //inputText: '',
        text: '',
        response: [],
        user: ''
      }
   
    }
   
   uploadData(){
    
      // var email_rule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

      // if (!email_rule.test(this.state.TextInputEmail)) {
      //    if (this.state.TextInputEmail != null && this.state.TextInputEmail != "") {
      //       if (this.state.TextInputPassword != null && this.state.TextInputPassword != "") {

      //          const { TextInputEmail }  = this.state ;
      //          const{ text } = this.state ;
               
      //          let formData = new FormData();
      //          formData.append('Email', TextInputEmail);
      //          formData.append('Password', text);
      //          fetch(`http://140.115.81.199:9943/signUp`,
      //          {
      //             method: 'POST',
      //             headers: {
      //                'Accept': 'application/json',
      //                'Content-Type': 'multipart/form-data',
      //          },
      //             body: formData
      //          })
      //          .then(response => {
      //             console.log(response.status);
      //          })
      //          .then(result => {
      //             console.log("success", result)
      //          })
      //          .catch(error => {
      //             console.log("error", error)
      //          })
      //          //副頁面傳遞參數給history
      //          this.props.navigation.navigate('歷史紀錄',{
      //             user : this.state.TextInputEmail.replace("@gmail.com", " ") ,
      //          })
      
      //    } else {
      //          Alert.alert("密碼不能為空");
      //       }

      //    } else {
      //       Alert.alert("帳號不能為空");
      //   } 
      //    else {
      //    Alert.alert("Email格式錯誤");
      //  }
      
      sha256(this.state.TextInputPassword).then(hash => {
         this.setState({ text:hash })
      });
      
      var email_rule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
      //console.log(email_rule.test(this.state.TextInputEmail))
    
      if (this.state.TextInputEmail != null && this.state.TextInputEmail != "") {
          if (this.state.TextInputPassword != null && this.state.TextInputPassword != "") {
               if (email_rule.test(this.state.TextInputEmail)) {
                  if( this.state.TextInputPassword.length>5){

                  const { TextInputEmail }  = this.state ;
                  //const { TextInputPassword }  = this.state ;
                  const{ text } = this.state ;
                  let  user   = this.state.TextInputEmail.replace("@gmail.com", "");
                  let formData = new FormData();
                  formData.append('Email', TextInputEmail);
                  //formData.append('Password', TextInputPassword);
                  formData.append('Password', text);
                  formData.append( "userName" , user);
                  fetch(`http://140.115.81.199:9943/signUp`,
                  {
                     method: 'POST',
                     headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                     },
                     body: formData,
                  })
                  .then(response => {
                     console.log(response.status);
                     if(response.status == 500){
                        Alert.alert("此帳號已被註冊")
                     } else{
                        this.props.navigation.navigate('歷史紀錄',{
                           user : this.state.TextInputEmail.replace("@gmail.com", "") ,
                        })
                     }
                  })
                  .then(result => {
                     console.log("success", result)
                  })
                  .catch(error => {
                     console.log("error", error)
                  })

                  // const { navigation } = this.props;
                  // navigation.navigate('歷史紀錄');
            
               // 副頁面傳遞參數給history
                  this.props.navigation.navigate('歷史紀錄',{
                     user : this.state.TextInputEmail.replace("@gmail.com", "") ,
                  })
               // const { username } = (result['Email'].replace("@gmail.com", " "));

           
                  try {
                    AsyncStorage.setItem('userName', user)
                    console.log("storage"+user)
                  } catch (e) {
                     console.log("error",error)
                     // saving error
                  }

                  } else{
                     Alert.alert("密碼需要6碼以上");
                  }
               } else{
                  Alert.alert("Email格式錯誤");
               }
         } else {
               Alert.alert("密碼不能為空");
           }

      } else {
         Alert.alert("帳號不能為空");
         } 
   }

   backtolaunch(){
      const { navigation } = this.props;
      navigation.navigate('啟動頁面');
   }

   instruction(){
      Alert.alert("輸入信箱及密碼後，進入SPEECHORD");
   }

   // convertSHA(){
   //    //Encode SHA256 
   //    sha256(this.state.TextInputPassword).then(hash => {
   //    this.setState({ text:hash })
   //    });
   // }


/* 
register = (email, pass) => {
   const { navigation } = this.props;
   alert('email: ' + email + '\npassword: ' + pass)
   navigation.navigate('歷史紀錄');
}
*/


render() {
   var email_rule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
   const emailErrors = () => {
      return email_rule.test(this.state.TextInputEmail);
     // return !this.state.TextInputEmail.includes('@');
   };

   const passwordErrors = () => {
      return this.state.TextInputPassword.length>5;
   };

   return (
      <View style = {styles.container}>

         {/* <Overlay transparent={true} visible={this.state.modalVisible} onClose={this.onClose} closeOnTouchOutside>
            <Icon
               name='book-open'
               type='feather'
               color='black' />
            <Text h4>Instructions</Text>
         </Overlay> */}

         <Header
            rightComponent={{ icon: 'question', color: '#fff',
            onPress: () => this.instruction()
            }}
            centerComponent={{ text: '註冊', style: { fontSize: 18, color: '#fff' } }}
            leftComponent={{ icon: 'home', color: '#fff',
            onPress: () => this.backtolaunch()
      
            }}/>

         <Input 
            style = {styles.input}
            underlineColorAndroid = "transparent"
            placeholder='email@address.com '
            placeholderTextColor = "#ccc"
            autoCapitalize = "none"
            keyboardType = "email-address"
            returnKeyType = "next"
            //onChangeText = {this.handleEmail}
            onChangeText={TextInputEmail => this.setState({TextInputEmail})}
            //value={this.state.TextInputEmail}

            leftIcon={
            <Icon
                name='email'
                type='fontisto'
                color='black'/>
            }
            errorStyle={{ color: 'red' }}
            //errorMessage='ENTER A VALID EMAIL HERE'
             />
         <HelperText type="error" visible={emailErrors()} >
            有效信箱
         </HelperText>

         <Input 
            style = {styles.input}
            underlineColorAndroid = "transparent"
            placeholder = "PASSWORD "
            placeholderTextColor = "#ccc"
            autoCapitalize = "none"
            returnKeyType = "next"
            secureTextEntry = {true}
            //onChangeText = {this.handlePassword}
            onChangeText={TextInputPassword => this.setState({ TextInputPassword })}
            value={this.state.TextInputPassword}

            leftIcon={
             <Icon
                 name='passport'
                 type='fontisto'
                 color='black'/>
             }
            errorStyle={{ color: 'red' }}
           // errorMessage='AT LEAST 6 WORDS OR NUMBERS '
         />

         <HelperText type="error" visible={passwordErrors()}>
            有效密碼
         </HelperText>

      {/* 
         <TouchableOpacity
            style = {styles.submitButton}
            onPress = {
               //() => this.register(this.state.email, this.state.password)
               this.InsertDataToServer}>
            <Text style = {styles.submitButtonText}>送出註冊資料</Text>
         </TouchableOpacity> */}

         
         <TouchableOpacity
            style = {styles.submitButton}
            onPress={()=> this.uploadData()}>

            <Text style = {styles.submitButtonText}>進入 SPEECHORD </Text>
         </TouchableOpacity>
         
         {/* <TouchableOpacity
            style={styles.button}
            title="Conver sh5"
            //onPress={this.convertSHA.bind(this)}
            onPress={()=> this.convertSHA()}
            >
               <Text>Conver to SHA 256</Text>
         </TouchableOpacity> */}

         {/* <Text style={styles.textStyle}>{this.state.text}</Text>  */}
         {/* <Image
            style={styles.tinyLogo}
            source={require('./Common.jpg')}
         /> */}
         
      </View>
   )
}
}
export default Inputs

const styles = StyleSheet.create({
container: {
   paddingTop: 23
},
input: {
   margin: 15,
   paddingLeft:8,
   height: 40,
   borderColor: '#eeeeee',
   borderWidth: 1
},
submitButton: {
   backgroundColor: 'darkblue',
   padding: 10,
   alignItems:'center',
   margin: 15,
   height: 40,
},
submitButtonText:{
   color: 'white',
   fontSize: 15,
},
})