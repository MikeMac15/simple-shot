
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Pressable } from "react-native"
import { Stack, Link, router} from "expo-router"
import { createDominionMeadows, setUpCourse, updateCourseData } from "@/constants/API";
import PieChart from 'react-native-pie-chart'
// import { getHoleData, removeHoleData, setHoleData, startUp18 } from "@/constants/API";

const DominionMeadows = createDominionMeadows();

export default function SimpleCounter(){
   
    const [holeNum, setHoleNum] = useState(1)
// Shot variables
    const [strokes, setStrokes] = useState(0)
    const [pure, setPure] = useState(0)
    const [good, setGood] = useState(0)
    const [bad, setBad] = useState(0)
    const [putt, setPutt] = useState(0)
    const [totals, setTotals] = useState<number[]>([0,0,0,0])
    const colors = ["skyblue","green","salmon","gold"]
    const setUpCourseAPI = async() => {
        setUpCourse(DominionMeadows);
    }

    useEffect(()=>{
        setUpCourseAPI();
    },[])

    const resetForNewHole = () : void => {
      setPure(0);
      setGood(0);
      setBad(0);
      setPutt(0);
      setStrokes(0);
      setTotals([0,0,0,0])
    }
    
    const saveAndReset = () : void => {
    if ( strokes > 0 ){
    // DominionMeadows.holes[holeNum-1].addPure(pure)
        // DominionMeadows.holes[holeNum-1].addGood(good)
        // DominionMeadows.holes[holeNum-1].addBad(bad)
        // DominionMeadows.holes[holeNum-1].addPutt(putt)
        DominionMeadows.holes[holeNum-1].updateHole(pure,good,bad,putt);
        DominionMeadows.courseUpdate();
        updateCourseData(DominionMeadows);
        resetForNewHole();
        setHoleNum(holeNum + 1);
    }
    }

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
                <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic', fontWeight:'900', textShadowColor:'black', textShadowOffset:{width:10, height:10}, textShadowRadius:15,width:100}}>{DominionMeadows.holes[holeNum-1].yardage}yrds</Text>
                {/* <Text style={{fontSize:12, color:'black', fontStyle:'italic', fontWeight:'800'}}> :Black </Text> */}
            </View>
            <View>
                <Text style={{fontSize:12, color:'#ccc', fontStyle:'italic', fontWeight:'800'}}>Par</Text>
                <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic', fontWeight:'900'}}>{DominionMeadows.holes[holeNum-1].par}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'baseline'}}>
                
                <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic', fontWeight:'900', textShadowColor:'crimson', textShadowOffset:{width:10, height:10}, textShadowRadius:15, width:100}}>{DominionMeadows.holes[holeNum-1].wYardage}yrds</Text>
            </View>
                
                
        </View>
        )
    }

    const RoundInfo = () => {
        return (
            <View style={{ backgroundColor:'#333', flex:1, display:'flex', flexDirection:'column', justifyContent:'center',height: '100%', width: "100%", paddingBottom: 10}}>
                <View style={{flex:1,backgroundColor:'#222', paddingRight:40, paddingTop:10, }}>

                <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
                    <Text style={styles.titleText}>Strokes:</Text>
                    <Text style={{textAlign: 'center', fontSize: 40, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>{strokes}</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
                    <Text style={styles.titleText}>Putts:</Text>
                    <Text style={{textAlign: 'center', fontSize: 40, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>{strokes}</Text>
                </View>
                </View>
                <View style={{flex:1,width:'100%',flexDirection:'column', alignItems:'center', justifyContent:'center', paddingRight:40 }}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginRight:5,fontSize: 10, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}> Total Score: </Text>
                        {DominionMeadows.toPar <= 0 ?
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'limegreen', fontStyle: 'italic', fontWeight:'700'}}>{DominionMeadows.toPar > 0 ? `+${DominionMeadows.toPar}` : DominionMeadows.toPar}</Text>
                        : DominionMeadows.toPar > 15 ?
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'red', fontStyle: 'italic', fontWeight:'700'}}>{DominionMeadows.toPar > 0 ? `+${DominionMeadows.toPar}` : DominionMeadows.toPar}</Text>
                        : DominionMeadows.toPar > 10 ?
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'salmon', fontStyle: 'italic', fontWeight:'700'}}>{DominionMeadows.toPar > 0 ? `+${DominionMeadows.toPar}` : DominionMeadows.toPar}</Text>
                        : DominionMeadows.toPar > 5 ?
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'pink', fontStyle: 'italic', fontWeight:'700'}}>{DominionMeadows.toPar > 0 ? `+${DominionMeadows.toPar}` : DominionMeadows.toPar}</Text>
                        :
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color:'white', fontStyle: 'italic', fontWeight:'700'}}>{DominionMeadows.toPar > 0 ? `+${DominionMeadows.toPar}` : DominionMeadows.toPar}</Text>
                        }
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginRight:5,fontSize: 10, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>Total Strokes:</Text>
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>{DominionMeadows.strokes + strokes}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginRight:5,fontSize: 10, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>GIR:</Text>
                        <Text style={{marginRight:5,textAlign: 'center', fontSize: 20, color: 'whitesmoke', fontStyle: 'italic', fontWeight:'700'}}>{`${DominionMeadows.gir}/${DominionMeadows.holesPlayed} `}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>
                        <Text style={{fontSize:10, color:'white'}}>Goal:</Text>
                        <Text style={{fontSize:10, color:'white'}}>{`${DominionMeadows.girGoal}/18`}</Text>
                    </View>
                </View>
            </View>
        )
    }
    const HolePieChart = () => {
        return(
            <PieChart widthAndHeight={200} series={totals} sliceColor={colors} 
             coverRadius={0.45} coverFill={
                                                                                                             (DominionMeadows.strokes/DominionMeadows.holesPlayed) <= 4.2 ?'#555'
                                                                                                            :(DominionMeadows.strokes/DominionMeadows.holesPlayed) <= 4.5 ?'skyblue'
                                                                                                            :(DominionMeadows.strokes/DominionMeadows.holesPlayed) <= 5.5 ?'limegreen'
                                                                                                            :(DominionMeadows.strokes/DominionMeadows.holesPlayed) <= 6 ?'salmon' 
                                                                                                            :(DominionMeadows.holesPlayed==0) ? 'white'
                                                                                                                                : 'red'}  />
        )
    }
    const BlankPieChart = () => {
        return <PieChart widthAndHeight={200} series={[1,1,1]} sliceColor={['#eee','#ccc','#aaa']} coverRadius={0.45} coverFill={
                                                                                                                                 (DominionMeadows.strokes/DominionMeadows.holesPlayed) <= 4.2 ?'#555'
                                                                                                                                :(DominionMeadows.strokes/DominionMeadows.holesPlayed) <= 4.5 ?'skyblue'
                                                                                                                                :(DominionMeadows.strokes/DominionMeadows.holesPlayed) <= 5.5 ?'limegreen'
                                                                                                                                :(DominionMeadows.strokes/DominionMeadows.holesPlayed) <= 6 ?'salmon' 
                                                                                                                                :(DominionMeadows.holesPlayed==0) ? 'white'
                                                                                                                                : 'red'}  />
    }
    // const OgHoleInfo = () => {
    //     return (
    //         <View style={{flexDirection:"row", justifyContent:'space-evenly', alignItems:'center'}}>
    //       <Text style={{fontSize:30, color:'whitesmoke', fontStyle:'italic', marginRight:40, fontWeight:'bold'}}>Hole {holeNum}</Text>
    //         <View  style={{flexDirection:'column'}}>
    //             <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic'}}>Par: {DominionMeadows.holes[holeNum-1].par}</Text>
    //             <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic'}}>Black: {DominionMeadows.holes[holeNum-1].yardage}yrds</Text>
    //             <Text style={{fontSize:20, color:'whitesmoke', fontStyle:'italic'}}>Red: {DominionMeadows.holes[holeNum-1].wYardage}yrds</Text>
    //         </View>
    //     </View>
    //     )
    // }
    const ThreeCircles = () => {
        return(
            
            <View style={{ display:'flex', flexDirection:'row',  justifyContent: 'space-around', width: "100%", paddingBottom: 40 }}>
                <View style={{height:100, width:100, justifyContent:'center', alignItems: 'center', backgroundColor: `hwb(190, ${(100 - Math.round(pure / (strokes - putt) * 100)*3)}%, 10%)`, borderRadius: 50,}}>
                <Text style={styles.titleText}>Pure</Text>
                    <Text style={styles.Text1}>{pure}</Text>
                    <Text>{ pure > 0 ? Math.round(pure / (strokes - putt) * 100): 0}%</Text>
                </View>

                <View style={{ height:100, width:100, justifyContent:'center', alignItems: 'center', backgroundColor:`hwb(94, ${(100 - Math.round(good / (strokes ) * 100)*2)}%, 10%)`, borderRadius: 50,}}>
                <Text style={styles.titleText}>Good</Text>
                    <Text style={styles.Text1}>{good}</Text>
                    <Text>{ good > 0 ? Math.round(good / (strokes - putt) * 100): 0}%</Text>
                </View>

                <View style={{height:100, width:100, justifyContent:'center', alignItems: 'center', backgroundColor:`hwb(0, ${(100 - Math.round(bad / (strokes) * 100)*2)}%, 10%)`, borderRadius: 50,}}>
                <Text style={styles.titleText}>Bad</Text>
                    <Text style={styles.Text1}>{bad}</Text>
                    <Text>{ bad > 0 ? Math.round(bad / (strokes - putt) * 100): 0}%</Text>
                </View>
            </View>
        )
    }

    const circles = (str:string,num:number) => {
        let circs = ''
        for (let i =0; i < num; i++){
            circs += str;
        }
        return circs;
    }

    const ShotBtns = () => {
        return (
            <View style={{width:'100%'}}>    
                    <TouchableOpacity activeOpacity={0.6} style={styles.pureBtn} onPress={()=> setPure(pure+1)} onLongPress={() => setPure(pure == 0 ? 0 : pure-1)}>
                        <Text style={styles.Text}>Pure</Text>
                        <Text style={styles.Text}>{pure ? circles('*',pure) : ' '}</Text> 
                    </TouchableOpacity>
            <View style={{flexDirection:'row', justifyContent:"center",width: '100%', marginVertical: 5,}}>

                <TouchableOpacity activeOpacity={0.6} style={styles.mid1} onPress={()=> setGood(good+1)} onLongPress={() => setGood(good == 0 ? 0 : good-1)} >
                    <Text style={styles.Text}>Good</Text> 
                    <Text style={styles.Text}>{good ? circles('*',good) : ' '}</Text> 
                </TouchableOpacity>

                
                <TouchableOpacity activeOpacity={0.6} style={styles.mid2} onPress={()=> setBad(bad+1)} onLongPress={() => setBad(bad == 0 ? 0 : bad-1)} >
                    <Text style={styles.Text}>Bad</Text> 
                    <Text style={styles.Text}>{bad ? circles('*',bad) : ' '}</Text> 
                </TouchableOpacity>

                </View>
                    <TouchableOpacity activeOpacity={0.6} style={styles.puttBtn} onPress={()=> setPutt(putt+1)} onLongPress={() => setPutt(putt == 0 ? 0 : putt-1)} >
                        <Text style={styles.Text}>Putt</Text> 
                        <Text style={styles.Text}>{putt ? circles('*',putt) : ' '}</Text> 
                    </TouchableOpacity> 
            </View>
           
        )
    }
    useEffect(()=>{
      setStrokes(pure+bad+good+putt);
      setTotals([pure,good,bad,putt])
    },[pure,bad,good,putt]);

    return (
    <View style={styles.container}>
                    {/* <Stack.Screen options={{title:'Simple Counter', headerTransparent: true, headerBackTitle: 'Menu', headerTitleStyle:{color: 'whitesmoke'} }} /> */}
                    <Stack.Screen options={{ title:`Hole ${holeNum}`, headerStyle:{backgroundColor:"#444"}, headerTitleStyle:{color:'whitesmoke',fontSize:30, fontWeight:'800'},
                    headerLeft: () => (
                    <Pressable
                        onPress={() =>
                        router.push('/Scorecard')
                        }
                    >
                        <Text style={{ color: "gold", fontSize: 18, fontWeight: "bold" }}>
                        Scorecard
                        </Text>
                    </Pressable>
                    // </Link>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={()=> saveAndReset()}>
                            <Text style={{flex: 1,color: 'lightblue', fontSize: 19, fontWeight:'bold', fontStyle:'italic'}}>Next {'>'}</Text>
                        </TouchableOpacity>
                    ),}}/>
        
        <HoleInfo />

        <View style={styles.container}>
            <View style={{flex:1,flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <RoundInfo/>
                <View style={{marginHorizontal:10}}>
                    {strokes > 0
                    ?   <HolePieChart />
                    :   <BlankPieChart />
                }
                    
                    
                </View>
            </View>
            {/* <ThreeCircles/> */}
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
    
    pureBtn: {
        
        backgroundColor: 'skyblue',
        paddingTop: 15, 
        
        width: '100%',
        
        
    },
    goodBtn: {
        
        backgroundColor: 'lightgreen',
        paddingVertical: 30,
        
        width: '100%',
        
        
    },
    badBtn: {
        
        backgroundColor: 'salmon',
        paddingVertical: 30,
        marginVertical: 5,
        width: '100%',
        
        
    },
    puttBtn: {
        
        backgroundColor: 'gold',
        paddingTop: 15,
        
        width: '100%',
       
        
        
    },
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
    }
    
    
});