
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Pressable, Modal, Alert, Button } from "react-native"
import { Stack, Link, router, useLocalSearchParams} from "expo-router"
import { createNewCourseRound, updateCourseData, Hole, Course, Teebox, Round } from "@/constants/API";

import PieChart from 'react-native-pie-chart'
import ScorecardElement from "@/components/ScorecardElem";
// import { getHoleData, removeHoleData, setHoleData, startUp18 } from "@/constants/API";

export default function SimpleCounter(){
    const colors = ["skyblue","green","salmon","gold"]
    const roundID = 0
    // Shot variables
     const [holeNum, setHoleNum] = useState(1)
     const [gir, setGIR] = useState(false);
     const [fir, setFIR] = useState(false);
     useEffect(()=>{console.log('setup')},[])
     //////////////////////// SetUp /////////////////////
     const params = useLocalSearchParams();
     const {courseName, teeColor, girGoal, puttGoal, firGoal, strokeGoal} = params
     
     // console.log(courseID, courseName, teeColor, girGoal, puttGoal, firGoal, strokeGoal)
     const [modalVisible, setModalVisible] = useState(false);
     const nums = [1,2,3,4,5,6,7,8,9];
     // Creates new course from parameters ^^^
        //how to update after each hole finished  --->  Round?.addRoundHole(CurrentHole, holeShotData.strokes, ...pure, ...)
        
        const [userCourse, setUserCourse] = useState<Course>(createNewCourseRound(courseName, teeColor, Number(girGoal), Number(puttGoal), Number(firGoal), Number(strokeGoal)))
        const [tee, setTee] = useState<Teebox>(userCourse.teeboxes[teeColor])
        const [currentHole, setCurrentHole] = useState<Hole>(userCourse?.teeboxes[teeColor].holes[holeNum])
        const [thisRound, setThisRound] = useState<Round>( new Round(roundID) )
        const [shotData, setShotData] = useState<{ [key: string]: number }>({
            strokes: 0,
            pure: 0,
            good: 0,
            bad: 0,
            putt: 0
        });
        
        useEffect(()=>{setCurrentHole(userCourse?.teeboxes[teeColor].holes[holeNum])},[holeNum])

    const resetForNewHole = () : void => {
      setShotData({
        strokes: 0,
        pure: 0,
        good: 0,
        bad: 0,
        putt: 0
      });
      setGIR(false);
      setFIR(false);
    }
    
    const saveAndReset = () : void => {
    if ( shotData.strokes > 0 ){
        thisRound.addRoundHole(currentHole,gir,shotData.putt,shotData.pure,shotData.good,shotData.bad,fir);
        // updateCourseData(userCourse)
        resetForNewHole()
        setHoleNum(holeNum + 1);
        console.log(thisRound)
        console.log(thisRound.totalStrokes)
    }
    }

    const addShotData = (shotType: string) => {
        setShotData(prevState => ({...prevState,
            [shotType]: prevState[shotType] + 1,
            strokes: prevState.strokes + 1
        }));
    };
    const subShotData = (shotType: string) => {
        setShotData(prevState => ({...prevState,
            [shotType]: prevState[shotType] - 1,
            strokes: prevState.strokes - 1
        }));
    };

    const HoleInfo = () => {
        return (
        <View style={{flexDirection:'row',
            justifyContent:'space-evenly',
            alignItems:'center',
            backgroundColor:'#666',
            width: '100%',
            padding:10
        }}>
            <View style={{flexDirection:'row', alignItems:'baseline'}}>
                <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic', fontWeight:'900', textShadowColor:'black', textShadowOffset:{width:10, height:10}, textShadowRadius:15,width:100}}>{currentHole.yardage}yrds</Text>
            </View>
            <View>
                <Text style={{fontSize:12, color:'#ccc', fontStyle:'italic', fontWeight:'800'}}>Par</Text>
                <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic', fontWeight:'900'}}>{currentHole.par}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'baseline'}}>
                
                <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic', fontWeight:'900', textShadowColor:'crimson', textShadowOffset:{width:10, height:10}, textShadowRadius:15, width:100}}>{currentHole.redYardage}yrds</Text>
            </View>
                
                
        </View>
        )
    }

    const RoundInfo = () => {
        return (
            <View style={{ backgroundColor:'#333', flex:1, display:'flex', flexDirection:'column', justifyContent:'center',height: '100%', width: "100%", paddingBottom: 10}}>
                <View style={{flex:1,backgroundColor:'#222', paddingRight:40, paddingTop:10}}>

                <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
                    <Text style={styles.titleText}>Strokes:</Text>
                    <Text style={{textAlign: 'center', fontSize: 40, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>{shotData.strokes}</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
                    <Text style={styles.titleText}>Putts:</Text>
                    <Text style={{textAlign: 'center', fontSize: 40, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>{shotData.putt}</Text>
                </View>
                </View>
                <View style={{flex:1,width:'100%',flexDirection:'column', alignItems:'center', justifyContent:'center', paddingRight:40 }}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginRight:5,fontSize: 10, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}> Total Score: </Text>
                        {thisRound.toPar <= 0 ?
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'limegreen', fontStyle: 'italic', fontWeight:'700'}}>{thisRound.toPar > 0 ? `+${thisRound.toPar}` : thisRound.toPar}</Text>
                        : thisRound.toPar > 15 ?
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'red', fontStyle: 'italic', fontWeight:'700'}}>{thisRound.toPar > 0 ? `+${thisRound.toPar}` : thisRound.toPar}</Text>
                        : thisRound.toPar > 10 ?
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'salmon', fontStyle: 'italic', fontWeight:'700'}}>{thisRound.toPar > 0 ? `+${thisRound.toPar}` : thisRound.toPar}</Text>
                        : thisRound.toPar > 5 ?
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'pink', fontStyle: 'italic', fontWeight:'700'}}>{thisRound.toPar > 0 ? `+${thisRound.toPar}` : thisRound.toPar}</Text>
                        :
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'white', fontStyle: 'italic', fontWeight:'700'}}>{thisRound.toPar > 0 ? `+${thisRound.toPar}` : thisRound.toPar}</Text>
                        }
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginRight:5,fontSize: 10, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>Total Strokes:</Text>
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>{thisRound.totalStrokes + shotData.strokes}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginRight:5,fontSize: 10, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>GIR:</Text>
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>{`${thisRound.GIRs}/${thisRound.holesPlayed} `}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>
                        <Text style={{fontSize:10, color:'white'}}>Goal:</Text>
                        <Text style={{fontSize:10, color:'white'}}>{`${userCourse?.teeboxes[teeColor].girGoal}/18`}</Text>
                    </View>
                </View>
            </View>
        )
    }


    const HolePieChart = () => {
        return(
            <PieChart widthAndHeight={200} series={[shotData.pure,shotData.good,shotData.bad,shotData.putt]} sliceColor={colors} 
             coverRadius={0.45} coverFill={
                                                                                                             (shotData.strokes/thisRound.holesPlayed) <= 4.2 ?'#555'
                                                                                                            :(shotData.strokes/thisRound.holesPlayed) <= 4.5 ?'skyblue'
                                                                                                            :(shotData.strokes/thisRound.holesPlayed) <= 5.5 ?'limegreen'
                                                                                                            :(shotData.strokes/thisRound.holesPlayed) <= 6 ?'salmon' 
                                                                                                            :(thisRound.holesPlayed==0) ? 'white'
                                                                                                                                : 'red'}  />
        )
    }
    const BlankPieChart = () => {
        return <PieChart widthAndHeight={200} series={[1,1,1]} sliceColor={['#eee','#ccc','#aaa']} coverRadius={0.45} coverFill={
                                                                                                                                 (shotData.strokes/thisRound.holesPlayed) <= 4.2 ?'#555'
                                                                                                                                :(shotData.strokes/thisRound.holesPlayed) <= 4.5 ?'skyblue'
                                                                                                                                :(shotData.strokes/thisRound.holesPlayed) <= 5.5 ?'limegreen'
                                                                                                                                :(shotData.strokes/thisRound.holesPlayed) <= 6 ?'salmon' 
                                                                                                                                :(thisRound.holesPlayed==0) ? 'white'
                                                                                                                                : 'red'}  />
    }
    // const OgHoleInfo = () => {
    //     return (
    //         <View style={{flexDirection:"row", justifyContent:'space-evenly', alignItems:'center'}}>
    //       <Text style={{fontSize:30, color:'whitesmoke', fontStyle:'italic', marginRight:40, fontWeight:'bold'}}>Hole {holeNum}</Text>
    //         <View  style={{flexDirection:'column'}}>
    //             <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic'}}>Par: {userCourse.holes[holeNum-1].par}</Text>
    //             <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic'}}>Black: {userCourse.holes[holeNum-1].yardage}yrds</Text>
    //             <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic'}}>Red: {userCourse.holes[holeNum-1].wYardage}yrds</Text>
    //         </View>
    //     </View>
    //     )
    // }
    // const ThreeCircles = () => {
    //     return(
            
    //         <View style={{ display:'flex', flexDirection:'row',  justifyContent: 'space-around', width: "100%", paddingBottom: 40 }}>
    //             <View style={{height:100, width:100, justifyContent:'center', alignItems: 'center', backgroundColor: `hwb(190, ${(100 - Math.round(pure / (strokes - putt) * 100)*3)}%, 10%)`, borderRadius: 50,}}>
    //             <Text style={styles.titleText}>Pure</Text>
    //                 <Text style={styles.Text1}>{pure}</Text>
    //                 <Text>{ pure > 0 ? Math.round(pure / (strokes - putt) * 100): 0}%</Text>
    //             </View>

    //             <View style={{ height:100, width:100, justifyContent:'center', alignItems: 'center', backgroundColor:`hwb(94, ${(100 - Math.round(good / (strokes ) * 100)*2)}%, 10%)`, borderRadius: 50,}}>
    //             <Text style={styles.titleText}>Good</Text>
    //                 <Text style={styles.Text1}>{good}</Text>
    //                 <Text>{ good > 0 ? Math.round(good / (strokes - putt) * 100): 0}%</Text>
    //             </View>

    //             <View style={{height:100, width:100, justifyContent:'center', alignItems: 'center', backgroundColor:`hwb(0, ${(100 - Math.round(bad / (strokes) * 100)*2)}%, 10%)`, borderRadius: 50,}}>
    //             <Text style={styles.titleText}>Bad</Text>
    //                 <Text style={styles.Text1}>{bad}</Text>
    //                 <Text>{ bad > 0 ? Math.round(bad / (strokes - putt) * 100): 0}%</Text>
    //             </View>
    //         </View>
    //     )
    // }

    // const circles = (str:string,num:number) => {
    //     let circs = ''
    //     for (let i =0; i < num; i++){
    //         circs += str;
    //     }
    //     return circs;
    // }

    const ShotBtns = () => {
        return (
            <View style={{}}>
                    <TouchableOpacity activeOpacity={0.6} style={styles.shotBtn} onPress={()=> addShotData('pure')} onLongPress={() => subShotData('pure')}>
                        <View style={styles.centeredRow}>
                            
                            <View style={[styles.BtnCountContainer,styles.pureBackground]}>
                                <Text style={styles.BtnCount} >{shotData.pure}</Text>
                            </View>
                            
                            <Text style={[styles.BtnText,styles.pureText]}>Great</Text>

                        </View>    
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} style={styles.shotBtn} onPress={()=> addShotData('good')} onLongPress={() => subShotData('good')}>
                        <View style={styles.centeredRow}>
                            
                            <View style={[styles.BtnCountContainer,styles.goodBackground]}>
                                <Text style={styles.BtnCount} >{shotData.good}</Text>
                            </View>
                            
                            <Text style={[styles.BtnText,styles.goodText]}>Good</Text>

                        </View>    
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} style={styles.shotBtn} onPress={()=> addShotData('bad')} onLongPress={() => subShotData('bad')}>
                        <View style={styles.centeredRow}>
                            
                            <View style={[styles.BtnCountContainer,styles.badBackground]}>
                                <Text style={styles.BtnCount} >{shotData.bad}</Text>
                            </View>
                            
                            <Text style={[styles.BtnText,styles.badText]}>Bad</Text>

                        </View>    
                    </TouchableOpacity>
                    
            </View>
           
        )
    }

    const CheckBoxes = () => {
        return(
            <View style={{flexDirection:'column', marginRight:20}}>
                <TouchableOpacity activeOpacity={0.6} style={{marginBottom:5}} onPress={()=> setFIR(prevState => !prevState)}>
                <View style={[{width:70, height:70, backgroundColor: "#666", borderRadius:15,  alignItems:'center', borderWidth:3,}, fir ? {borderColor:'yellowgreen'} : {borderColor:'salmon'}]}>
                    <Text style={fir ? styles.goodText : styles.badText}>FIR</Text>
                    <Text style={{backgroundColor:'grey', width:'100%', height:2}}> </Text>
                    
                    <Text style={[{fontSize:40, fontStyle:'italic'}, fir ? styles.goodText : styles.badText]}>{fir ? 'V' : 'X'}</Text>

                </View>
                </TouchableOpacity>


                <TouchableOpacity activeOpacity={0.6} style={{marginVertical:5}} onPress={()=> setGIR(prevState => !prevState)}>
                    <View style={[{width:70, height:70, backgroundColor: "#666", borderRadius:15,  alignItems:'center', borderWidth:3,}, gir ? {borderColor:'yellowgreen'} : {borderColor:'salmon'}]}>
                        <Text style={gir ? styles.goodText : styles.badText}>GIR</Text>
                        <Text style={{backgroundColor:'grey', width:'100%', height:2}}> </Text>
                        
                        <Text style={[{fontSize:40, fontStyle:'italic'}, gir ? styles.goodText : styles.badText]}>{gir ? 'V' : 'X'}</Text>

                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} style={{marginTop:5}} onPress={()=> addShotData('putt')} onLongPress={()=> subShotData('putt')}>
                    <View style={[{width:70, height:70, backgroundColor: "#666", borderRadius:15,  alignItems:'center', borderWidth:3,}, shotData.putt <= 2 ? {borderColor:'yellowgreen'} : {borderColor:'salmon'}]}>
                        <Text style={shotData.putt <= 2 ? styles.goodText : styles.badText}>Putt</Text>
                        <Text style={{backgroundColor:'grey', width:'100%', height:2}}> </Text>
                        
                        <Text style={[{fontSize:40, fontStyle:'italic'}, shotData.putt <= 2 ? styles.goodText : styles.badText]}>{shotData.putt}</Text>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    // useEffect(()=>{
    //   setStrokes(pure+bad+good+putt);
    //   setTotals([pure,good,bad,putt])
    // },[pure,bad,good,putt]);

    return (
    <View style={styles.container}>
                    {/* <Stack.Screen options={{title:'Simple Counter', headerTransparent: true, headerBackTitle: 'Menu', headerTitleStyle:{color: 'whitesmoke'} }} /> */}
                    <Stack.Screen options={{ title:`Hole ${holeNum}`, headerStyle:{backgroundColor:"#444"}, headerTitleStyle:{color:'whitesmoke',fontSize:30, fontWeight:'800'},
                    headerLeft: () => (
                    
                        <Button title='Scorecard' onPress={()=>setModalVisible(!modalVisible)}/>
                    
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={()=> saveAndReset()}>
                            <Text style={{flex: 1,color: 'lightblue', fontSize: 19, fontWeight:'bold', fontStyle:'italic'}}>Next {'>'}</Text>
                        </TouchableOpacity>
                    ),}}/>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Scorecard</Text>
                {Object.keys(tee.holes).map((key) =>
                <View key={key} style={{flexDirection:'row'}}>
                 <Text >Hole {tee.holes[key].num} </Text>
                 <Text > Par:{tee.holes[key].par}</Text>
                 <Text> Score: {Number(thisRound.holesPlayed) >= Number(key) ?
                 thisRound.holes[key].toPar + tee.holes[key].par : 0}</Text>
                </View>
            )}

                <Text>{thisRound.FIRs}</Text>
                <Text>{thisRound.GIRs}</Text>
                <Text>{thisRound.toPar}</Text>
                <Text>3:{thisRound.toPar3}</Text>
                <Text>4:{thisRound.toPar4}</Text>
                <Text>5:{thisRound.toPar5}</Text>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide</Text>
                </Pressable>
            </View>
            </View>
        </Modal>








        
        <HoleInfo />
        

        <View style={styles.container}>
            <View style={{flex:1,flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <RoundInfo/>
                <View style={{marginHorizontal:10}}>
                    {shotData.strokes > 0
                    ?   <HolePieChart />
                    :   <BlankPieChart />
                    }
                    
                    
                </View>
            </View>
            
            {/* <ThreeCircles/> */}
        </View>   

        <View style={{flexDirection:'row', alignItems:'center', marginVertical: 40}}>
            <CheckBoxes/>
            <ShotBtns/>
        </View>    
    </View>

)}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: "#444",
        // paddingTop:10,
        width: '100%'
    },

    titleText: {
        color: 'white',
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: '600',
        marginBottom: 5,
        marginRight:2
    },
    BtnCountContainer:{paddingHorizontal:20, paddingVertical:10, borderBottomLeftRadius:15,borderTopLeftRadius:15},
    BtnCount:{
        fontSize:40,
        textAlign:'center',
        marginLeft:5,
        fontStyle: 'italic',
        fontWeight: '400',
    },
    shotBtn: {
        width:200,
        backgroundColor: '#333',
        borderRadius:15,
        borderWidth:1,
        borderColor:"#777",
        marginVertical:5
    },
    BtnText: {
        textAlign: 'center',
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: '600',
        paddingHorizontal:25,
        
    },
    pureText:{color:'skyblue'},
    pureBackground:{backgroundColor:'skyblue'},
    goodText:{color:'yellowgreen'},
    goodBackground:{backgroundColor:'yellowgreen'},
    badText:{color:'salmon'},
    badBackground:{backgroundColor:'salmon'},
    puttText:{color:'whitesmoke'},
    puttBackground:{backgroundColor:'whitesmoke'},
    centeredRow:{flexDirection:'row',  alignItems:'center',},
    Text: {
        textAlign: 'center',
        // color: 'white',
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: '600',
        
    },
    Text1: {
        textAlign: 'center',
        // color: 'white',
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: '600',
        
    },
    addSubBtn : {
      color: 'black',
      backgroundColor: 'grey',
      borderRadius: 25,
      padding: 5,
      width: 40
      
    },
    mid1 : {
        width:'50%', backgroundColor:'limegreen',
        paddingTop: 35, paddingBottom:5, marginRight:2.5
    },
    mid2 : {
        width:'50%', backgroundColor:'salmon',paddingTop: 35, paddingBottom:5,marginLeft:2.5
    },



    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
    
    
});