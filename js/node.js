/**
 * file: node.js
 * description: implementation of a binary search tree for the purposes of storing question
 * author: Joseph Farrell
 */

var Node = (options) => {
    return Object.assign({}, value, left, right);
}

Node.prototype.insert = (value) => {
    if(value <= this.value) {
        if(!this.left) {
            this.left = new Node(value);
        } else {
            this.left.insert(value);
        }
    }
    else if(value > this.value) {
        if(!this.right) {
            this.right = new Node(value);
        } else {
            this.right.insert(value);
        }
    }
};

Node.prototype.contains = (value) => {
    if(value === this.value) {
        return true;
    }
    else if(value <= this.value) {
        if(this.left) {
            this.left.contains(value);
        } else {
            return false;
        }
    }
    else if(value > this.value) {
        if(this.right) {
            this.right.contains(value);
        } else {
            return false;
        }
    }
};