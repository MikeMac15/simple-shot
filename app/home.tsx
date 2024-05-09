import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, TextInput, StyleSheet, Alert } from "react-native";

export default function HomeScreen(){
    const [gir, setGIR] = useState('')
    const [fir, setFIR] = useState('')
    const [strokes, setStrokes] = useState('')
    const [putts, setPutts] = useState('')

    const [goodToGo, setGTG] = useState(false)

    useEffect(()=>{
        if (gir != '' && fir != '' && strokes != '' && putts != ''){
            setGTG(true)
        }
    },[gir,fir,strokes,putts]);

  

    return (
        <View>
            <View>
                <Text style={styles.Title}>Goals for Today</Text>
                <View style={styles.goalTable}>
                    <View style={styles.inputTable}>
                        <Text style={styles.inputTitle}>Strokes</Text>
                        <TextInput
                            style={styles.goalInput}
                            onChangeText={setStrokes}
                            value={strokes}
                            placeholder="75"
                            keyboardType="numeric"
                            />
                    </View>
                    <View style={styles.inputTable}>
                        <Text style={styles.inputTitle}>Putts</Text>
                        <TextInput
                            style={styles.goalInput}
                            onChangeText={setPutts}
                            value={putts}
                            placeholder="36"
                            keyboardType="numeric"
                            />
                    </View>
                    <View style={styles.inputTable}>
                        <Text style={styles.inputTitle}>FIR</Text>
                        <TextInput
                            style={styles.goalInput}
                            onChangeText={setFIR}
                            value={fir}
                            placeholder="7/14"
                            keyboardType="numeric"
                            />
                    </View>
                    <View style={styles.inputTable}>
                        <Text style={styles.inputTitle}>GIR</Text>
                        <TextInput
                            style={styles.goalInput}
                            onChangeText={setGIR}
                            value={gir}
                            placeholder="9/18"
                            keyboardType="numeric"
                            />
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={()=> {
                if (goodToGo==false){
                    Alert.alert('Set your goals for the round.', 'No goals + No prep = No progress', [
                        
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                      ]);
                }
            }}>
                {
                    goodToGo ?
                    <Link replace href={{pathname:'/ShotTracker', params:{courseID:1,courseName:'Dominion Meadows',teeColor:'Black',girGoal:gir, puttGoal:putts, firGoal:fir, strokeGoal:strokes}}}>
                    Play Dominion Meadows
                </Link>
                : <Text>Play Dominion Meadows</Text>
                }
            </TouchableOpacity>
            {/* <TouchableOpacity>
                <Link href={{pathname:'/ShotTracker', params:{courseID:1,courseName:'Dominion Meadows',teeColor:'Red'}}}>
                    Play Dominion Meadows Reds
                </Link>
            </TouchableOpacity> */}
            <TouchableOpacity>
                <Link href={{pathname:'/ShotTracker', params:{courseID:2}}}>
                    Play Echo Falls
                </Link>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    Title: {textAlign:'center',fontSize:30, paddingVertical:20},
    goalTable: { display:'flex', flexDirection:'row', width:'100%', justifyContent:'space-evenly' },
    inputTable: {display:'flex',flexDirection:'column', backgroundColor:'white', borderColor:'black', borderRadius:10,padding:20,borderWidth:1 },
    inputTitle: {textAlign:'center',fontSize:20, fontStyle:'italic',fontWeight:'bold', paddingBottom:10},
    goalInput: {fontSize:20},

})