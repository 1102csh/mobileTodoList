import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function App() {
  
  /* 입력한 데이터를 저장할 변수와 해당 데이터들이 저장될 배열 */
  const [todoList, setTodoList] = useState([]);
  const [todoText, setTodoText] = useState('');

  /* 전체, 미완료, 완료 상태 구분을 위한 변수 */
  const [filterType, setFilterType] = useState('all');
  const [isAll, setIsAll] = useState(true);
  const [isIncompleted, setIsIncompleted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  /* 
    투두리스트에 데이터를 추가하는 함수
    각각의 데이터는 고유번호, 텍스트, 완료여부의 key, value를 가짐
  */
  const addTodo = () => {
    if (todoText.trim() !== '') {
      const newTodo = {
        id: Date.now().toString(),
        text: todoText,
        completed: false,
      };
      setTodoList([...todoList, newTodo]);
      setTodoText('');
    }
  };

  
  /* 
    체크박스를 누르면 해당 id의 데이터를 반대값으로 처리함 -> key: completed의 value를 반대값로 
    react에서 제공하는 prev라는 키워드가 붙은 useState를 사용함으로써 이전 상태의 배열에서 안전하게 구성
  */
  const toggleTodo = (id) => {
    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /* 투두리스트 동일한 id 데이터 삭제 */
  const deleteTodo = (id) => {
    setTodoList((prevTodoList) => prevTodoList.filter((todo) => todo.id !== id));
  };

  /* 투두리스트 내의 completed key의 벨류가 false인 데이터의 개수를 세서 출력 */
  const getRemainingTodos = () => {
    return todoList.filter((todo) => !todo.completed).length;
  };

  /* 
    전체, 미완료, 완료를 클릭하여 각 상태의 데이터들을 볼 수 있게 하는 기능
    삼항연산자로 구현했다가 바뀜
  */
  const getFilteredTodos = () => {
    if (filterType === 'completed') {
      return todoList.filter((todo) => todo.completed);
    } else if (filterType === 'incomplete') {
      return todoList.filter((todo) => !todo.completed);
    } else {
      return todoList;
    }
  };

  /* 
    todoList 배열에 있는 데이터들을 map과 유사한 방식으로 하나씩 받아옴
    map을 배울 때 item, index를 받아왔다면 지금의 경우 index를 id로 대체
  */
  const renderItem = ({ item }) => {
    return (
      <View style={styles.todoItem}>
        <BouncyCheckbox
          size={24}
          isChecked={item.completed}
          fillColor="skyblue"
          unfillColor="#FFFFFF"
          iconStyle={{ borderColor: "skyblue" }}
          onPress={() => toggleTodo(item.id)}
        />
        <Text style={[styles.todoText, item.completed && styles.completedTodo]}>{item.text}</Text>
        <TouchableOpacity onPress={() => deleteTodo(item.id)} style={{ marginRight: 15 }}>
          <Image source={require('./assets/xicon.png')} style={{ width: 17, height: 17 }} />
        </TouchableOpacity>
      </View>
    );
  };

  /* 현재 날짜 정보 출력 */
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const result = `${year}년 ${month}월 ${day}일`;
    return result;
  };

  return (
    <LinearGradient
      colors={['orchid', 'aquamarine']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.wrap}>
      
        <Text style={styles.currentDate}>{getCurrentDate()}</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.remainingText}>남은 일 {getRemainingTodos()}</Text>
          <View style={styles.toggleButtons}>
            <TouchableOpacity 
              onPress={() => {
                setFilterType('all');
                setIsAll(true);
                setIsIncompleted(false);
                setIsCompleted(false);
              }}
              style={[ styles.btn , isAll && styles.activeBtn]}
            >
              <Text style={[styles.btnText, isAll && styles.activeBtnText]}>모두</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                setFilterType('incomplete');
                setIsAll(false);
                setIsIncompleted(true);
                setIsCompleted(false);
              }}
              style={[ styles.btn , isIncompleted && styles.activeBtn]}
            >
              <Text style={[styles.btnText, isIncompleted && styles.activeBtnText]}>미완료</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                setFilterType('completed');
                setIsAll(false);
                setIsIncompleted(false);
                setIsCompleted(true);
              }}
              style={[ styles.btn , isCompleted && styles.activeBtn]}
            >
              <Text style={[styles.btnText, isCompleted && styles.activeBtnText]}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.input}
          onChangeText={setTodoText}
          value={todoText}
          placeholder="할 일을 입력하세요"
          placeholderTextColor="lightgray"
          onSubmitEditing={addTodo}
        />

        <FlatList
          data={getFilteredTodos()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>할 일이 없습니다</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wrap: {
    flex: 0.6,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  currentDate: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "left",
  },
  remainingText: {
    flex: 1,
    fontSize: 18,
    color: "gray"
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "white",
    marginRight: 1,
  },
  activeBtn: {
    backgroundColor: "gray",
  },
  btnText: { color: "gray" },
  activeBtnText: { color: "white" },
  listContent: {
    flexGrow: 1,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  input: {
    height: 40,
    borderColor: "lightgray",
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});
