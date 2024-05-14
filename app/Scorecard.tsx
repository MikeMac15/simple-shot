import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Course, Hole, Round, Teebox, getScoreCardData } from '@/constants/API';
import { useEffect, useState } from 'react';


export default function ModalScreen() {
  const params = useLocalSearchParams();
  const { courseName, teeColor, roundID } = params;

  const [course, setCourse] = useState<Course>();
  const [front9Array, setFront9Array] = useState<Hole[]>([]);
  const [back9Array, setBack9Array] = useState<Hole[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentCourse = await getScoreCardData(courseName);
        setCourse(currentCourse);
        console.log("courseTees", currentCourse?.teeboxes);
      } catch (error) {
        // Handle error
        console.error("Error fetching course data:", error);
      }
    };
    fetchData();
  }, [courseName]); // Include courseName in dependency array

  useEffect(() => {
    if (!course || !course.teeboxes || !teeColor || typeof teeColor === 'object') return;
  
    const teebox = course.teeboxes[teeColor];
    if (!teebox || !teebox.holes) return;
  
    const holes: Hole[] = Object.values(teebox.holes);
    
    // Ensure holes array has at least 9 elements before slicing
    if (holes.length >= 9) {
      const frontNineHoles: Hole[] = holes.slice(0, 9);
      setFront9Array(frontNineHoles);
    }
  
    // Ensure holes array has at least 18 elements before slicing for back nine
    if (holes.length >= 18) {
      const backNineHoles: Hole[] = holes.slice(9, 18);
      setBack9Array(backNineHoles);
    }
  }, [course, teeColor]);


  interface Show9HoleScorcardProps {
    holeArray: Hole[];
    front: boolean;
  }
  const Show9HoleScorcard: React.FC<Show9HoleScorcardProps> = ({ holeArray, front }) => {
    return (
      <View>
          <Text style={{ fontSize: 20,color:"#888", fontStyle:'italic', fontWeight:'800' }}>{front? "Front 9" : "Back 9"}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Hole: </Text>
            {holeArray ?
              holeArray.map((hole) => (
                <View key={hole.num} style={{paddingHorizontal:5, backgroundColor: 'lightgrey', width:30, borderWidth:.5,borderColor:'#444'}}>
                  <Text style={{textAlign:'center',fontSize:17}} key={hole.num}>{hole.num}</Text>
                </View>
              ))
              :
              <Text>Loading...</Text>
            }
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Par_: </Text>
            {holeArray ?
              holeArray.map((hole) => (
                <View key={hole.num} style={{paddingHorizontal:5, backgroundColor: 'grey', width:30, borderWidth:.5,borderColor:'#444'}}>
                  <Text style={{fontSize:20, textAlign:'center'}} key={hole.num}>{hole.par}</Text>
                </View>
              ))
              :
              <Text>Loading...</Text>
            }
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>ToPar</Text>
            {/* {holeArray ?
              holeArray.map((hole) => (
                <View key={hole.num} style={hole.toPar < 0 ? styles.good : hole.toPar > 0 ? styles.bad : styles.par}>
                <Text style={{textAlign:'center',fontSize:15}} key={hole.num}>{hole.toPar > 0 ? `+${hole.toPar}` : hole.toPar}</Text>
                </View>
              ))
              : */}
              <Text>Loading...</Text>
            {/* // } */}
          </View>
      </View>
    )
  }



  return (

    <View style={styles.container}>
      
      {/* <Text style={styles.title}>Scorecard</Text> */}

      <View style={{ flexDirection: 'column' }}>
  {/* Front 9 holes */}
      <Show9HoleScorcard holeArray={front9Array} front={true}/>
      <Show9HoleScorcard holeArray={back9Array} front={false}/>

  {/* Back 9 holes */}
    
  </View>



      {/* {course ? (
        course.holes.map((hole) => (
          <View key={hole.num} style={{ flexDirection: 'row' }}>
      <Text style={{ marginHorizontal: 10 }}>{hole.num}</Text>
      <Text style={{ marginHorizontal: 10 }}>{hole.par}</Text>
      <Text style={{ marginHorizontal: 10 }}>{hole.totalShots}</Text>
    </View>
  ))
) : (
  <Text>Loading...</Text>
)} */}


<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

<View style={{flexDirection:'row'}}>
<View style={styles.stats}>

    <Text style={styles.title}>Putts Per Hole:</Text>
    <Text style={styles.title}>To Par:</Text>
    <Text style={styles.title}>GIR:</Text>
</View>
  
  {/* <View style={styles.stats}>
    <Text style={(Math.round((putts/holesPlayed)*100) / 100) <= 2 ? styles.statGood : styles.statBad }>{(Math.round((putts/holesPlayed)*100) / 100)}</Text>
    <Text style={totalScore/holesPlayed > 6 ? styles.statBad : totalScore/holesPlayed > 5.5 ? styles.stat : styles.statGood}>{totalScore> 0 ? `+${totalScore}`: totalScore}</Text>
    <Text style={Math.floor((GIR/holesPlayed)* 100) >= 60 ? styles.statGood : Math.floor((GIR/holesPlayed)* 100) <= 40 ? styles.statBad : styles.stat}>{GIR}/{holesPlayed} - {Math.floor((GIR/holesPlayed)* 100)}%</Text>
  </View> */}
</View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  stats:{flexDirection:'column',justifyContent:'center',marginHorizontal:10},
  stat: {marginHorizontal:10,fontSize: 20,fontWeight: 'bold',},
  statGood: {marginHorizontal:10,fontSize: 20,fontWeight: 'bold',color:'limegreen'},
  statBad: {marginHorizontal:10,fontSize: 20,fontWeight: 'bold',color: 'salmon'},
  good: {backgroundColor: '#8BCC37', width:30, padding:5, borderWidth:.5,borderColor:'#444'},
  par: {backgroundColor: 'grey', width:30,padding:5, borderWidth:.5,borderColor:'#444'},
  bad: {backgroundColor: 'salmon', width:30, padding:5, borderWidth:.5,borderColor:'#444'},
});
