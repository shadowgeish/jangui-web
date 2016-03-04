'''
Created on 31 janv. 2016

@author: serge
'''

def get_dic_item_value(dic,key):
    val = None
    try:
        val = dic[key]
    except:
        val = None
    return val

if __name__ == '__main__':
    pass