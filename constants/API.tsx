import AsyncStorage from '@react-native-async-storage/async-storage';


export const setUpCourse = async(course: Course) => {
  try {
    const courseStringify = JSON.stringify(course)
    await AsyncStorage.setItem('course', courseStringify)
  } catch(e) {
            console.error(e)
        }
}

export const updateCourseData = async(course: Course) => {
  try {
    const courseStringify = JSON.stringify(course)
    await AsyncStorage.setItem('course', courseStringify)
  } catch (e) {
    console.error(e)
  }
}

export const getScoreCardData = async() => {
  try {
    const jsonData = await AsyncStorage.getItem('course')
    return jsonData != null ? JSON.parse(jsonData) : null
  } catch(e){
    console.error(e)
  }
}

export const resetScorecard = async () => {
  try {
    await AsyncStorage.removeItem('course')
  } catch(e) {console.error(e)}
  console.log('removed.')
}
// export const setHoleData = async (holeArr: any, holeNum: number) => {
//     try {
//         const jsonValue = JSON.stringify(holeArr)
//         await AsyncStorage.setItem(`Hole_${holeNum}`, jsonValue)
//     } catch(e) {
//         console.error(e)
//     }
//     console.log("Done.")
// }

// export const getHoleData = async (holeNum: number) => {
//     try {
//         const jsonValue = await AsyncStorage.getItem(`Hole_${holeNum}`)
//         return jsonValue != null ? JSON.parse(jsonValue) : null
//     } catch(e) {
//         console.error(e)
//     }
//     console.log("Done.")
// }

// export const removeHoleData = async (holeNum:number) => {
//     try{ await AsyncStorage.removeItem(`Hole_${holeNum}`)}
//     catch(e) {console.error(e)}
//     console.log('removed.')
// }

// export const startUp18 = async () => {
//     const initHoles = {}
//     try {
//         for (let i = 1; i <= 18; i++) {
//             initHoles[`Hole_${i}`] = []
//         }
//         console.log(initHoles)

//     } catch (e) {

//     }
// }

export class Hole {
    num: number;
    par: number;
    yardage: number;
    wYardage: number;
    putts: number;
    pure: number;
    good: number;
    bad: number;
    totalShots: number;
    toPar: number;
    played: boolean;
    gir: boolean;
    gotPar: boolean;
    gotBogey: boolean;
    gotBirdie: boolean;
    gotEagle: boolean;
    gotOverBogey: boolean;
  
    constructor(num:number,par:number,yardage:number,wYardage:number) {
      this.num = num,
      this.par = par,
      this.yardage = yardage,
      this.wYardage = wYardage,
      this.putts = 0,
      this.pure = 0,
      this.good = 0,
      this.bad = 0,
      this.totalShots = 0,
      this.toPar = 0,
      this.played = false,
      this.gir = false,
      this.gotPar = false,
      this.gotBirdie = false,
      this.gotBogey = false,
      this.gotEagle = false,
      this.gotOverBogey = false
    }
  
    addPure(num:number): void {
      this.pure = num;
      this.totalShots += num;
    }
    
    
    addGood(num:number): void {
      this.good = num;
      this.totalShots += num;
    }
    
    
    addBad(num:number): void {
      this.bad = num;
      this.totalShots += num;
    }
    
    
    addPutt(num:number): void {
      this.putts = num;
      this.totalShots += num;
    }
    
    
    
    
    greenInRegs(): void {
      this.gir = (this.totalShots - this.putts) <= (this.par - 2);
    }
  
    updateToPar(): void {
      
      this.toPar = this.totalShots > 0 ? (this.totalShots - this.par) : 0;

      switch (this.toPar) {
        case -2:
          this.gotEagle = true
        case -1:
          this.gotBirdie = true
          break;
        case 0:
          this.gotPar = true
          break;
        case 1:
          this.gotBogey = true
          break;
        default:
          this.gotOverBogey = true
          break;
      }
      
    }

    updateHole(pure:number,good:number,bad:number, putts:number): void {
      this.addPure(pure);
      this.addGood(good);
      this.addBad(bad);
      this.addPutt(putts);
      this.played = true;
      this.greenInRegs();
      this.updateToPar();
    }

    
    // subPure(): void {
      //   if (this.pure > 0){
        //     this.pure--;
      //     this.totalShots--;
      //   }
      // }
     // subGood(): void {
      //   if (this.good > 0){
      //     this.good--;
      //     this.totalShots--;
      //   }
      // }
      // subBad(): void {
      //   if (this.bad > 0){
      //     this.bad--;
      //     this.totalShots--;
      //   }
      // }
      // subPutt(): void {
      //   if (this.putts > 0){
      //     this.putts--;
      //     this.totalShots--;
      //   }
      // }
    
  }
  
  export class Course {
    name: String;
    holes: Hole[];
    par: number;
    strokes: number;
    girGoal: number;
    puttGoal: number;
    gir: number;
    putts: number;
    holesPlayed: number;
    toPar: number;
  
    constructor() {
      this.name = "Dominion Meadows"
      this.holes = []
      this.par = 72
      this.strokes = 0
      this.gir = 0
      this.girGoal = 10
      this.putts = 0
      this.puttGoal = 36
      this.holesPlayed = 0
      this.toPar = 0
    }
  
    addHole(hole: Hole): void {
      this.holes.push(hole);
    }
  
    // getTotalPar(): number {
    //   return this.holes.reduce((total,hole)=> total += hole.par, 0)
    // }
    getTotalDist(): number {
      return this.holes.reduce((total,hole)=> total += hole.yardage, 0)
    }
    getTotalWDist(): number {
      return this.holes.reduce((total,hole)=> total += hole.wYardage, 0)
    }
    getTotalPure(): number {
      return this.holes.reduce((total,hole)=> total += hole.pure, 0)
    }
    getTotalGood(): number {
      return this.holes.reduce((total,hole)=> total += hole.good, 0)
    }
    getTotalBad(): number {
      return this.holes.reduce((total,hole)=> total += hole.bad, 0)
    }


    setToPar(): void {
      const score = this.holes.reduce((total, hole) => total += hole.toPar, 0);
      this.toPar = score
    }


    setTotalShots(): void {
      const total = this.holes.reduce((total,hole)=> total += hole.totalShots, 0)
      this.strokes = total
    }
    setTotalPutts(): void {
      const totalPutts = this.holes.reduce((total,hole)=> total += hole.putts, 0)
      this.putts = totalPutts
    }
    setGIR(): void {
      const gir = this.holes.reduce((total, hole) => total + (hole.gir ? 1 : 0), 0);
      this.gir = gir 
    }
    setHolesPlayed(): void {
      const numPlayed = this.holes.reduce((total, hole)=> total + (hole.played ? 1 : 0), 0);
      this.holesPlayed = numPlayed;
    }
    courseUpdate(): void {
      this.setTotalShots();
      this.setTotalPutts();
      this.setHolesPlayed();
      this.setGIR();
      this.setToPar();
    }
  }

  export const createDominionMeadows = () => {
    const par = [4,3,4,4,5,5,4,4,3,4,3,4,4,4,5,3,5,4]
    const blackYardage = [267,187,531,314,462,573,391,360,216,392,260,445,394,426,552,206,605,424]
    const redYardage = [210,125,286,263,370,415,299,260,101,320,187,306,250,279,381,95,462,286]

    const DominionMeadows = new Course();

    for (let i = 1; i <= 18; i++){
      const hole = new Hole(i,par[i-1],blackYardage[i-1],redYardage[i-1]);
      DominionMeadows.addHole(hole);
    }

    return DominionMeadows;
  }