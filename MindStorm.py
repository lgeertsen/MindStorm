import sys

def move_forward(distance):
    print("MoveForward " + str(distance))

def move_back(distance):
    print("MoveBack " + str(distance))

def move_left(distance):
    print("MoveLeft " + str(distance))

def move_right(distance):
    print("MoveRight " + str(distance))

def rotate_head(x, y, z):
    print("RotateHead " + str(x) + " " + str(y)+ " " + str(z))

def rotate_left_shoulder(x, y):
    print("RotateLeftShoulder " + str(x) + " " + str(y))

def rotate_right_shoulder(x, y):
    print("RotateRightShoulder " + str(x) + " " + str(y))

def rotate_left_forearm(x):
    print("RotateLeftForearm " + str(x))

def rotate_left_thigh(x, y):
    print("RotateLeftThigh " + str(x) + " " + str(y))

def rotate_left_thigh_z(angle):
    print("RotateLeftThigh " + str(angle))
    x = input("")

def rotate_right_thigh_z(angle):
    print("RotateRightThigh " + str(angle))
    x = input("")

def rotate_left_calf(angle):
    print("RotateLeftKnee " + str(angle))
    x = input("")

def rotate_right_calf(angle):
    print("RotateRightKnee " + str(angle))
    x = input("")

def rotate_left_foot(angle):
    print("RotateLeftAnkle " + str(angle))
    x = input("")

def rotate_right_foot(angle):
    print("RotateRightAnkle " + str(angle))
    x = input("")

def rotate_left_toe(angle):
    print("RotateLeftToe " + str(angle))
    x = input("")

def rotate_right_toe(angle):
    print("RotateRightToe " + str(angle))
    x = input("")

def rotate_hip_x(angle):
    print("RotateHipZ " + str(angle))
    x = input("")

def rotate_hip_y(angle):
    print("RotateHipX " + str(angle))
    x = input("")

def rotate_hip_z(angle):
    print("RotateHipY " + str(angle))
    x = input("")
